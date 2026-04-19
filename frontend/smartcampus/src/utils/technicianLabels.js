const TECHNICIANS = new Map([
  [5, { name: "Nethmi Perera" }],
  [6, { name: "Kasun Silva" }],
  [7, { name: "Dinuka Fernando" }],
  [8, { name: "Ayesh Maduranga" }],
  [9, { name: "Sanduni Jayasekara" }],
  [10, { name: "Ravindu Peris" }],
]);

export const getTechnicianLabel = (id) => {
  if (id === null || id === undefined) return "";
  const numericId = Number(id);
  const tech = TECHNICIANS.get(numericId);
  if (!tech) return `Technician #${id}`;
  return `${tech.name} (Technician #${numericId})`;
};
