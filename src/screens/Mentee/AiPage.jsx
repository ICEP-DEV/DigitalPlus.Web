import React, { useState, useRef, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary"; // Importing ErrorBoundary
import styles from "./AiPage.module.css"; // Importing CSS module
import mammoth from "mammoth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import jsPDF from "jspdf";
import {
  AiOutlinePaperClip,
  AiOutlineExclamationCircle,
  AiOutlineArrowDown,
} from "react-icons/ai";
import SideBarNavBar from "./Navigation/SideBarNavBar";
import * as pdfjsLib from "pdfjs-dist/webpack";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Custom fallback component for ErrorBoundary
 */
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert" className={styles.errorFallback}>
      <AiOutlineExclamationCircle className={styles.errorIconFallback} />
      <p>Something went wrong:</p>
      <pre className={styles.errorMessage}>{error.message}</pre>
      <button className={styles.retryButton} onClick={resetErrorBoundary}>
        Try Again
      </button>
    </div>
  );
};

const AiPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(null);
  const timeoutRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [generatedAnswers, setGeneratedAnswers] = useState([]);
  const [error, setError] = useState(null);

  // Scroll references
  const messagesEndRef = useRef(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const chatWindowRef = useRef(null);

  /**
   * Utility function to display error messages in the UI only.
   * We do NOT add these to the AI chat history.
   */
  
  const displayError = (errorMessage) => {
    setMessages((prev) => [
      ...prev,
      { text: errorMessage, type: "error", role: "system" },
    ]);
  };

  /**
   * Extract text from PDF
   */
  const extractTextFromPDF = (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = function (event) {
        try {
          const typedArray = new Uint8Array(event.target.result);
          pdfjsLib
            .getDocument(typedArray)
            .promise.then((pdf) => {
              const maxPages = pdf.numPages;
              const pagePromises = [];
              for (let i = 1; i <= maxPages; i++) {
                pagePromises.push(
                  pdf.getPage(i).then((page) => page.getTextContent())
                );
              }
              Promise.all(pagePromises)
                .then((pages) => {
                  const pdfTextArray = pages.map((page) =>
                    page.items.map((item) => item.str).join(" ")
                  );
                  resolve(pdfTextArray.join("\n"));
                })
                .catch((err) => {
                  console.error("Error extracting text from PDF pages:", err);
                  reject(new Error("Failed to extract text from PDF pages."));
                });
            })
            .catch((error) => {
              console.error("Error loading PDF:", error);
              reject(new Error("Failed to load the PDF document."));
            });
        } catch (error) {
          console.error("Unexpected error during PDF extraction:", error);
          reject(
            new Error("An unexpected error occurred while processing the PDF.")
          );
        }
      };

      reader.onerror = function (readError) {
        console.error("FileReader error during PDF extraction:", readError);
        reject(new Error("Failed to read the PDF file. It might be corrupted."));
      };

      reader.readAsArrayBuffer(file);
    });
  };

  /**
   * Extract text from Word document
   */
  const extractTextFromWord = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async function () {
        try {
          const result = await mammoth.extractRawText({
            arrayBuffer: this.result,
          });
          resolve(result.value);
        } catch (error) {
          console.error("Error processing Word document:", error);
          reject(new Error("Failed to process the Word document."));
        }
      };
      reader.onerror = function (readError) {
        console.error("FileReader error during Word extraction:", readError);
        reject(new Error("Failed to read the Word file. It might be corrupted."));
      };
      reader.readAsArrayBuffer(file);
    });
  };

  /**
   * Handle file upload
   */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      displayError("No file selected.");
      return;
    }

    // Validate file type
    const acceptedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!acceptedTypes.includes(file.type)) {
      displayError(`Unsupported file type: ${file.type}`);
      return;
    }

    // Validate file size
    const MAX_SIZE_MB = 10;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      displayError(`File size exceeds ${MAX_SIZE_MB}MB limit.`);
      return;
    }

    setLoading(true);
    try {
      let text = "";
      if (file.type === "application/pdf") {
        text = await extractTextFromPDF(file);
      } else {
        text = await extractTextFromWord(file);
      }
      await generateQA(text);
    } catch (err) {
      console.error("Error extracting text:", err);
      displayError("Error extracting text: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate questions and answers using AI
   */
  const generateQA = async (text) => {
    setLoading(true);
    try {
      if (!text || !text.trim()) {
        throw new Error("No text provided for AI generation.");
      } else if (text.trim().length < 10) {
        throw new Error("The text is too short. Please provide more content or context.");
      }

      const API_KEY = "AIzaSyCtB69xLTHyHXoJs53SDYIAJpwoRZ8blDE";
      if (!API_KEY) {
        throw new Error("AI API key is missing.");
      }

      console.log("AI API Key:", API_KEY);

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      if (!model) {
        throw new Error("Could not retrieve the AI model.");
      }

      // Internal prompt we do NOT show to the user.
      const prompt = `From the following text, create clear, concise questions and answers that help someone study this material, no matter the subject or module. 
Each question should be prefixed with "Q: " and each answer with "A: ". The last question, if applicable, can focus on practical application. 
Be comprehensive but keep them easy to review:\n\n${text}`;

      // Only pass user/model messages to the AI
      const validHistory = messages
        .filter((msg) => msg.role === "user" || msg.role === "model")
        .map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.text }],
        }));

      const chat = model.startChat({
        history: validHistory,
        generationConfig: {
          maxOutputTokens: 8192,
        },
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      if (!response) {
        throw new Error("No response was received from the AI. Please try again later.");
      }

      const responseText = await response.text();
      console.log("AI Response:", responseText);

      if (!responseText) {
        throw new Error(
          "The AI returned an empty response. It may need more context or the text is too brief."
        );
      }

      // Split the AI response into lines
      const lines = responseText.split(/\r?\n/);
      // Filter lines to keep only those that start with "Q:" or "A:"
      const filteredLines = lines.filter((line) => {
        const trimmed = line.trim();
        return trimmed.startsWith("Q:") || trimmed.startsWith("A:");
      });

      if (filteredLines.length === 0) {
        throw new Error(
          "The AI response did not contain any Q:/A: lines. Possibly too little context or the AI didn't follow the format."
        );
      }

      // Separate Q's and A's for numbering
      const questions = filteredLines.filter((l) => l.trim().startsWith("Q:"));
      const answers = filteredLines.filter((l) => l.trim().startsWith("A:"));

      if (questions.length === 0) {
        throw new Error("No 'Q:' lines found. Please add more context or rephrase your text.");
      }
      if (answers.length === 0) {
        throw new Error("No 'A:' lines found. Please add more context or rephrase your text.");
      }

      // Number them
      const numberedQuestions = questions.map(
        (q, index) => `${index + 1}. ${q.trim()}`
      );
      const numberedAnswers = answers.map(
        (a, index) => `${index + 1}. ${a.trim()}`
      );

      setGeneratedQuestions(numberedQuestions);
      setGeneratedAnswers(numberedAnswers);

      // Only store the filtered Q/A lines in the chat's "model" message
      const finalQALines = filteredLines.join("\n");

      // Add user + model messages to messages array
      setMessages((prev) => [
        ...prev,
        { role: "user", type: "text", text: text.trim() },
        { role: "model", type: "text", text: finalQALines },
      ]);
    } catch (error) {
      console.error("Error generating questions and answers:", error);
      if (error.message.includes("malformed")) {
        displayError(
          "The AI response didn't match the expected Q:/A: format. " +
            "Try more detailed text or multiple paragraphs."
        );
      } else {
        displayError("Error generating questions and answers: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle manual text input submission
   */
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) {
      displayError("Cannot send an empty message.");
      return;
    }

    setMessages((prev) => [
      ...prev,
      { type: "text", role: "user", text: inputMessage.trim() },
    ]);
    await generateQA(inputMessage.trim());
    setInputMessage("");
  };

  /**
   * Handle deleting a message
   */
  const deleteMessage = (indexToDelete) => {
    setMessages(messages.filter((_, index) => index !== indexToDelete));
    setShowDropdown(null);
  };

  /**
   * PDF generation
   */
  const generatePDF = (contentArray, title) => {
    try {
      if (!contentArray || contentArray.length === 0) {
        throw new Error("No content available to generate PDF.");
      }

      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.height;
      const margin = 10;
      const lineHeight = 10;
      let yOffset = margin + 10;

      doc.setFontSize(14);
      doc.text(title, margin, margin);

      contentArray.forEach((content) => {
        const lines = doc.splitTextToSize(content, 180);
        lines.forEach((line) => {
          if (yOffset + lineHeight > pageHeight - margin) {
            doc.addPage();
            yOffset = margin;
          }
          doc.text(line, margin, yOffset);
          yOffset += lineHeight;
        });
      });

      doc.save(`${title}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      displayError("PDF generation failed: " + err.message);
    }
  };

  const downloadQuestionsAsPDF = () => {
    if (generatedQuestions.length === 0) {
      displayError("No questions available to download.");
      return;
    }
    generatePDF(generatedQuestions, "Generated Questions");
  };

  const downloadAnswersAsPDF = () => {
    if (generatedAnswers.length === 0) {
      displayError("No answers available to download.");
      return;
    }
    generatePDF(generatedAnswers, "Generated Answers");
  };

  /**
   * Handle long press (click and hold)
   */
  const handleLongPress = (index) => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(index);
    }, 700);
  };

  /**
   * Handle release of long press
   */
  const handleRelease = () => {
    clearTimeout(timeoutRef.current);
  };

  /**
   * Scroll to bottom utility
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * Check if user is near bottom to show/hide the scroll-to-bottom button
   */
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // If the user is more than ~50px away from bottom, show the button
    if (scrollHeight - scrollTop - clientHeight > 50) {
      setShowScrollToBottom(true);
    } else {
      setShowScrollToBottom(false);
    }
  };

  /**
   * Scroll automatically to bottom whenever messages change
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset any state if needed
        setMessages([]);
        setGeneratedQuestions([]);
        setGeneratedAnswers([]);
        setError(null);
      }}
    >
      <SideBarNavBar>
        <div className={styles.chatContainer}>
          <div
            className={styles.chatWindow}
            ref={chatWindowRef}
            onScroll={handleScroll}
          >
            <div className={styles.messages}>
              {messages.length === 0 ? (
                <p className={styles.noMessages}>
                  No messages yet. Upload a file or send a message to get started.
                </p>
              ) : (
                messages.map((message, index) => {
                  if (!message || !message.text) return null;
                  const isError = message.type === "error";

                  return (
                    <div
                      key={index}
                      className={styles.messageContainer}
                      onMouseDown={() => handleLongPress(index)}
                      onMouseUp={handleRelease}
                      onMouseLeave={handleRelease}
                    >
                      <div
                        className={`${styles.message} ${
                          isError ? styles.errorMessage : styles.textMessage
                        }`}
                      >
                        {isError && (
                          <AiOutlineExclamationCircle
                            className={styles.errorIcon}
                          />
                        )}
                        {/* Display lines of message.text separately */}
                        {message.text.split("\n").map((line, idx) => (
                          <p key={idx} className={styles.messageLine}>
                            {line}
                          </p>
                        ))}
                      </div>

                      {showDropdown === index && (
                        <div className={styles.dropdown}>
                          <button
                            className={styles.closeButton}
                            onClick={() => setShowDropdown(null)}
                          >
                            X
                          </button>
                          <button onClick={() => deleteMessage(index)}>
                            Delete
                          </button>
                          <button
                            onClick={downloadQuestionsAsPDF}
                            disabled={loading || generatedQuestions.length === 0}
                          >
                            Download Questions as PDF
                          </button>
                          <button
                            onClick={downloadAnswersAsPDF}
                            disabled={loading || generatedAnswers.length === 0}
                          >
                            Download Answers as PDF
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              {/* Dummy div to ensure auto-scroll to bottom */}
              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom button */}
            {showScrollToBottom && (
              <button
                className={styles.scrollToBottomButton}
                onClick={scrollToBottom}
              >
                <AiOutlineArrowDown className={styles.scrollToBottomIcon} />
              </button>
            )}
          </div>

          {/* Message Input Form */}
          <form className={styles.messageInputContainer} onSubmit={sendMessage}>
            <label htmlFor="upload-input" className={styles.clipUploadButton}>
              <AiOutlinePaperClip className={styles.clipIcon} />
            </label>
            <input
              type="file"
              id="upload-input"
              className={styles.uploadInput}
              onChange={handleFileUpload}
              disabled={loading}
              accept=".pdf, .docx"
            />

            <input
              type="text"
              className={styles.messageInput}
              placeholder="Type your question or paste notes here..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
            />

            <button type="submit" className={styles.sendButton} disabled={loading}>
              {loading ? "Processing..." : "Send"}
            </button>
          </form>

          {/* PDF Download Buttons */}
          <div className={styles.pdfButtonsContainer}>
            <button
              className={styles.pdfButton}
              onClick={downloadQuestionsAsPDF}
              disabled={loading || generatedQuestions.length === 0}
            >
              Download Questions as PDF
            </button>
            <button
              className={styles.pdfButton}
              onClick={downloadAnswersAsPDF}
              disabled={loading || generatedAnswers.length === 0}
            >
              Download Answers as PDF
            </button>
          </div>
        </div>
      </SideBarNavBar>
    </ErrorBoundary>
  );
};

export default AiPage;
