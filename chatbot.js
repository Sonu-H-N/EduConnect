/* EduConnect Study Buddy — lightweight, offline-friendly assistant. */
(function () {
  "use strict";

  const STORAGE_KEY = "educonnectAssistantChat";
  const MAX_HISTORY = 40;

  function readHistory() {
    try {
      const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(history) ? history.slice(-MAX_HISTORY) : [];
    } catch (error) {
      return [];
    }
  }

  function saveHistory(history) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-MAX_HISTORY)));
    } catch (error) {
      // Chat still works for the current page if browser storage is unavailable.
    }
  }

  function makeMessage(role, text) {
    const message = document.createElement("div");
    message.className = `study-buddy-message study-buddy-message--${role}`;
    message.setAttribute("role", "listitem");
    message.textContent = text;
    return message;
  }

  function getReply(input) {
    const text = input.toLowerCase();
    const assignments = readList("assignments");
    const notes = readList("notes");
    const doubts = readList("doubts");
    const notices = readList("notices");

    if (/\b(hi|hello|hey|good morning|good afternoon)\b/.test(text)) {
      return "Hi! I'm your EduConnect Study Buddy. Ask me about your assignments, notes, doubts, notices, or study strategies.";
    }
    if (/\b(help|what can you do|how do you work)\b/.test(text)) {
      return "I can help you find your way around EduConnect, summarize the learning items saved in this browser, and share study tips. Try asking ‘What assignments are pending?’ or ‘Show my notes’.";
    }
    if (/\b(assignment|assignments|homework|deadline|due)\b/.test(text)) {
      const pending = assignments.filter(item => !item.done);
      if (!assignments.length) return "There are no assignments saved here yet. Open Assignments from the sidebar to add one.";
      if (/\b(done|complete|completed|finished)\b/.test(text)) {
        const completed = assignments.filter(item => item.done);
        return completed.length
          ? `You have ${completed.length} completed assignment${completed.length === 1 ? "" : "s"}: ${completed.map(item => item.title).join(", 