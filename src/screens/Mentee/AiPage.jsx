import React, { useState, useRef } from "react";
import styles from "./AiPage.module.css"; // Importing CSS module
import mammoth from "mammoth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import jsPDF from "jspdf";
import { IoMdArrowRoundUp } from "react-icons/io";
//import './global.css';
import SideBarNavBar from "./Navigation/SideBarNavBar";
import * as pdfjsLib from 'pdfjs-dist/webpack';  // Correct Webpack import for pdfjs-dist

// Load worker from CDN or local path
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


const AiPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(null);
  const timeoutRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [generatedAnswers, setGeneratedAnswers] = useState([]);

  // Extract text from PDF
  const extractTextFromPDF = (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = function (event) {
        const typedArray = new Uint8Array(event.target.result);
        pdfjsLib.getDocument(typedArray).promise
          .then(function (pdf) {
            const maxPages = pdf.numPages;
            const pagePromises = [];

            for (let i = 1; i <= maxPages; i++) {
              pagePromises.push(
                pdf.getPage(i).then((page) => page.getTextContent())
              );
            }

            Promise.all(pagePromises).then((pages) => {
              const pdfTextArray = pages.map((page) =>
                page.items.map((item) => item.str).join(" ")
              );
              resolve(pdfTextArray.join("\n"));
            });
          })
          .catch(function (error) {
            console.error("Error processing PDF:", error);
            reject(error);
          });
      };

      reader.readAsArrayBuffer(file);
    });
  };
  

  // Extract text from Word document
  const extractTextFromWord = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async function () {
        try {
          const result = await mammoth.extractRawText({
            arrayBuffer: this.result,
          });
          resolve(result.value);
        } catch (error) {
          console.error("Error processing Word document:", error);
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      try {
        let text = "";
        if (fileType === "application/pdf") {
          text = await extractTextFromPDF(file);
        } else if (
          fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          text = await extractTextFromWord(file);
        } else {
          setMessages([
            ...messages,
            { text: "Unsupported file type", type: "error" },
          ]);
          return;
        }
        setMessages([
          ...messages,
          { text: `Uploaded File: ${file.name}`, type: "file" },
        ]);
        await generateQA(text);
      } catch (err) {
        setMessages([
          ...messages,
          { text: "Error extracting text: " + err.message, type: "error" },
        ]);
      }
    }
  };

  // Generate questions and answers using AI
  const generateQA = async (text) => {
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(
        "AIzaSyCROORHopfeC_FSbAF_HSAJsFqgXiiaRgA"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Generate questions and answers based on the following text, clearly separating each question and answer pair with "Q: " for questions and "A: " for answers if it is a programming notes a last question should be coding:\n\n${text}`;
      const chat = model.startChat({
        history: messages.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.text }],
        })),
        generationConfig: {
          maxOutputTokens: 10000,
        },
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const responseText = await response.text();

      // Split based on "Q: " and "A: " prefixes
      const qaPairs = responseText.split(/(?=Q: )|(?=A: )/);
      const questions = qaPairs.filter((q) => q.startsWith("Q:"));
      const answers = qaPairs.filter((a) => a.startsWith("A:"));

      // Numbering the questions and answers
      const numberedQuestions = questions.map(
        (q, index) => `${index + 1}. ${q}`
      );
      const numberedAnswers = answers.map((a, index) => `${index + 1}. ${a}`);

      setGeneratedQuestions(numberedQuestions);
      setGeneratedAnswers(numberedAnswers);

      setMessages([
        ...messages,
        { role: "user", text: prompt },
        { role: "model", text: qaPairs.join("\n") },
      ]);
    } catch (error) {
      console.error("Error generating questions and answers:", error);
      setMessages([
        ...messages,
        {
          text: "Error generating questions and answers: " + error.message,
          type: "error",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle sending a message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, type: "text" }]);
      await generateQA(inputMessage);
      setInputMessage("");
    }
  };

  // Handle deleting a message
  const deleteMessage = (indexToDelete) => {
    setMessages(messages.filter((_, index) => index !== indexToDelete));
    setShowDropdown(null);
  };

  // Improved PDF generation with multi-page support
  const generatePDF = (contentArray, title) => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    const lineHeight = 10;
    let yOffset = margin + 10;

    doc.setFontSize(14);
    doc.text(title, margin, margin);

    contentArray.forEach((content, idx) => {
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
  };

  const downloadQuestionsAsPDF = () => {
    generatePDF(generatedQuestions, "Generated Questions");
  };

  const downloadAnswersAsPDF = () => {
    generatePDF(generatedAnswers, "Generated Answers");
  };

  // Handle long press (click and hold) event
  const handleLongPress = (index) => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(index);
    }, 700);
  };

  // Handle release of long press
  const handleRelease = () => {
    clearTimeout(timeoutRef.current);
  };
  
  return (
  <SideBarNavBar>
    <div className={styles.chatContainer}>
      <div className={styles.chatWindow}>
        <label className={styles.uploadButton} htmlFor="upload-input">
          <IoMdArrowRoundUp style={{ marginRight: "5px", fontSize: "20px" }} />
          Upload File
        </label>
        <input
          type="file"
          id="upload-input"
          className={styles.uploadInput}
          onChange={handleFileUpload}
        />
        <div className={styles.messages}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={styles.messageContainer}
              onMouseDown={() => handleLongPress(index)}
              onMouseUp={handleRelease}
              onMouseLeave={handleRelease}
            >
              <div
                className={`${styles.message} ${
                  message.type === "file"
                    ? styles.fileMessage
                    : styles.textMessage
                }`}
              >
                {message.text
                  .replace(/[*#]/g, "") // Remove * and # from the text
                  .split("\n\n")
                  .map((line, idx) => (
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
                  <button onClick={() => deleteMessage(index)}>Delete</button>
                  <button onClick={downloadQuestionsAsPDF}>
                    Download Questions as PDF
                  </button>
                  <button onClick={downloadAnswersAsPDF}>
                    Download Answers as PDF
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <form className={styles.messageInputContainer} onSubmit={sendMessage}>
        <input
          type="text"
          className={styles.messageInput}
          placeholder="Paste your notes here"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button type="submit" className={styles.sendButton}>
          Send
        </button>
      </form>
      <button className={styles.pdfButton} onClick={downloadQuestionsAsPDF}>
        Download Questions as PDF
      </button>
      <button className={styles.pdfButton} onClick={downloadAnswersAsPDF}>
        Download Answers as PDF
      </button>
    </div>
    </SideBarNavBar>
  );
};

export default AiPage;
