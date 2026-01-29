import { doGet, doPut } from "../../apiHandler";

/* ================= VESSELS API ================= */
export const getVessels = async () => {
  return doGet("/vessel/aetms-vships");
};



export const updateVesselDirect = async (payload) => {
  const response = await fetch(`http://localhost:8055/api/vessel/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update vessel');
  }
  
  return response.json();
};