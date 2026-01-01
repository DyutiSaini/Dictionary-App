const input = document.getElementById("field");
const button = document.getElementById("btn");
const result = document.querySelector(".result");
const clearBtn = document.getElementById("clearbtn");
const toggleBtn = document.getElementById("toggleTheme");

const savedTheme = localStorage.getItem("theme");
if (savedTheme == "dark") {
  document.body.classList.add("dark");
}

const savedResult = localStorage.getItem("dictionaryResult");
if (savedResult) {
  result.innerHTML = savedResult;
}

const savedWord = localStorage.getItem("lastWord");
if (savedWord) {
  input.value = savedWord;
}

button.addEventListener("click", () => {
  let word = input.value.trim();
  if (word == "") {
    alert("Please enter the word.");
    return;
  }

  let apiURL = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

  fetch(apiURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Word not Found");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);

      const word = data[0].word;

      const phonetics = data[0].phonetics[0]?.text || "Not available";

      const audio = data[0].phonetics[0]?.audio;

      const partOfSpeech = data[0].meanings[0]?.partOfSpeech || "Unknown";

      const definition =
        data[0].meanings[0].definitions[0]?.definition || "No definition found";

      const example =
        data[0].meanings[0].definitions[0]?.example || "No example available";

      result.innerHTML = `<h2>${word}</h2>
        <p><strong>Phonetics : </strong>${phonetics}</p>
        <p><strong>Part of speech : </strong>${partOfSpeech}</p>
        <p><strong>Definition : </strong>${definition}</p>
        <p><strong>Example : </strong>${example}</p>
        ${audio ? `<audio controls src ="${audio}"></audio>` : ""}`;

      // result.innerHTML = output;
      localStorage.setItem("dictionaryResult", result.innerHTML);
      localStorage.setItem("lastWord", word);
    })
    .catch((error) => {
      console.log(error);
      result.innerHTML = `<p style ="color : red;">${error.message}</p>`;
      alert("Sorry, no meaning found.");
    });
});
clearBtn.addEventListener("click", () => {
  input.value = "";
  result.innerHTML = "";
  localStorage.removeItem("dictionaryResult");
  localStorage.removeItem("lastWord");
});
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDarkMode = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
});
