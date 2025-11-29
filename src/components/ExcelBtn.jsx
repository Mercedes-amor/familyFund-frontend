import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";

const DownloadExcelButton = ({ familyId }) => {
  const downloadExcel = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8080/api/families/${familyId}/export/full-excel`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al descargar el Excel");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "FamilyExport.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error("ENo se pudo descargar el Excel");
    }
  };

  return (
    <button onClick={downloadExcel} className="Excel-Btn">
      <img src="/images/Excel-ico.png" alt="Excel" className="Excel-ico" />
     
    </button>
  );
};

export default DownloadExcelButton;
