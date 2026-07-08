// Replace this with the actual ID from your chrome://extensions page!
// chrome
const EXTENSION_ID = "ikjnhdnpafmbabhkgnkhfnpegphlgkge";

const printButton = document.querySelector("#print-spa");

function handlePrintClick() {
  if (!window.chrome || !chrome.runtime) {
    alert("Extension not detected or you aren't using Chrome.");
    return;
  }

  chrome.runtime.sendMessage(
    EXTENSION_ID,
    { action: "FETCH_TAB_DATA" },
    (response) => {
      if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError.message);
        return;
      }

      if (!response) {
        alert("No response received from extension.");
        return;
      }

      if (response.error) {
        console.error("Error:", response.error);
        alert(response.error);
      } else {
        const data = response.data || {};
        const memberName = [data.lastName, data.firstName]
          .filter(Boolean)
          .join(", ");

        const params = new URLSearchParams({
          spa: data.spa || "",
          amount: data.amount || "",
          pin: data.philHealthNumber || "",
          memberName,
          certifiedBy: memberName,
          contact: data.contactNumber || data.email || "",
          autoPrint: "1",
        });

        const printUrl = `spa-form.html?${params.toString()}`;
        window.open(printUrl, "_blank", "noopener,noreferrer");
      }
    },
  );
}

if (printButton) {
  printButton.addEventListener("click", handlePrintClick);
}
