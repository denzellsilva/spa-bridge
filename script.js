// Replace this with the actual ID from your chrome://extensions page!
// chrome
const EXTENSION_ID = "edeofojjeddbgajejfleoghnlknendcf";

const getData = document.querySelector("#get");

function handleGetDataClick() {
  if (!window.chrome || !chrome.runtime) {
    alert("Extension not detected or you aren't using Chrome.");
    return;
  }

  // Send a request directly to your extension bridge
  chrome.runtime.sendMessage(
    YOUR_EXTENSION_ID,
    { action: "FETCH_TAB_DATA" },
    (response) => {
      if (response.error) {
        console.error("Error:", response.error);
        alert(response.error);
      } else {
        console.log("Data successfully retrieved!", response.data);

        document.getElementById("my-pin").value =
          response.data.philHealthNumber;
        document.getElementById("my-lastName").value = response.data.lastName;
        document.getElementById("my-firstName").value = response.data.firstName;
        document.getElementById("my-spa").value = response.data.spa;
        document.getElementById("my-amount").value = response.data.amount;
      }
    },
  );
}

getData.addEventListener("click", handleGetDataClick);
