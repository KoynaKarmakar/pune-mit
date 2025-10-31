import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const exportToPdf = async (elementId: string, fileName: string) => {
  const originalElement = document.getElementById(elementId);
  if (!originalElement) {
    console.error(`Element with id ${elementId} not found.`);
    return;
  }

  // 1. Clone the element to avoid modifying the original page
  const clonedElement = originalElement.cloneNode(true) as HTMLElement;
  clonedElement.id = "pdf-clone"; // Give it a unique ID

  // 2. Create a temporary stylesheet to override unsupported colors
  const style = document.createElement("style");
  style.id = "pdf-temp-styles";
  // This CSS forces all text and backgrounds within the clone to be simple and safe for html2canvas
  style.innerHTML = `
    #${clonedElement.id}, #${clonedElement.id} * {
      color: #000 !important;
      background-color: #fff !important;
      border-color: #000 !important;
    }
    #${clonedElement.id} .dark * {
        color: #fff !important;
        background-color: #1f2937 !important;
        border-color: #fff !important;
    }
  `;
  document.head.appendChild(style);

  // 3. Append the cloned element to the body, but keep it off-screen
  clonedElement.style.position = "absolute";
  clonedElement.style.left = "-9999px";
  // Ensure the clone has a defined width
  clonedElement.style.width = `${originalElement.offsetWidth}px`;
  document.body.appendChild(clonedElement);

  try {
    // 4. Run html2canvas on the temporarily styled clone
    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      // Ensure the background of the canvas is white
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasWidth / pdfWidth;
    const imgHeight = canvasHeight / ratio;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
    // 5. Clean up by removing the temporary stylesheet and cloned element
    document.head.removeChild(style);
    document.body.removeChild(clonedElement);
  }
};
