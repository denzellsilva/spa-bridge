// Listen for messages coming from your local web app website
chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    if (request.action === "FETCH_TAB_DATA") {
      // Find the currently open PhilHealth tab
      chrome.tabs.query({ url: "*://spagen.philhealth.gov.ph/*" }, (tabs) => {
        if (tabs.length === 0) {
          sendResponse({ error: "PhilHealth tab not found open." });
          return;
        }

        // Execute our scraping script inside that PhilHealth tab
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            func: extractDataFromPage,
          },
          (results) => {
            if (results && results[0]) {
              sendResponse({ data: results[0].result });
            } else {
              sendResponse({ error: "Failed to extract data." });
            }
          },
        );
      });
      return true; // Keeps the communication line open for the async response
    }
  },
);

// This is the actual function that executes INSIDE the PhilHealth page
// function extractDataFromPage() {
//   // 1. Grab values from the input boxes
//   const pinInput = document.querySelector("#pin").value;
//   const lastNameInput = document.querySelector("#lastName").value;
//   const firstNameInput = document.querySelector("#firstName").value;
//   const spa = document.querySelector("#infoSpa").innerText;
//   const amount = document.querySelector("#infoAmount").innerText;

//   return {
//     philHealthNumber: pinInput ? pinInput : "",
//     lastName: lastNameInput ? lastNameInput : "",
//     firstName: firstNameInput ? firstNameInput : "",
//     spa: spa ? spa : "",
//     amount: amount ? amount : "",
//     dialogData: dialogText,
//   };
// }

function extractDataFromPage() {
  // Finds the inputs by looking for the placeholder text you see on the screen
  const pinInput =
    // document.querySelector('input[placeholder*="PIN"]') ||
    document.querySelector("#pin");
  const lastNameInput =
    // document.querySelector('input[placeholder*="Last Name"]') ||
    document.querySelector("#lastName");
  const firstNameInput =
    // document.querySelector('input[placeholder*="First Name"]') ||
    document.querySelector("#firstName");

  // For the popup elements, we grab them by targeting the text contents
  const spa = document.querySelector("#infoSpa");
  // || document.querySelector(".spa-class");
  const amount = document.querySelector("#infoAmount");
  // || document.querySelector(".amount-class");

  return {
    philHealthNumber: pinInput ? pinInput.value : "PIN field not found",
    lastName: lastNameInput ? lastNameInput.value : "Last Name field not found",
    firstName: firstNameInput
      ? firstNameInput.value
      : "First Name field not found",
    spa: spa ? spa.innerText : "SPA data not found",
    amount: amount ? amount.innerText : "Amount data not found",
  };
}
