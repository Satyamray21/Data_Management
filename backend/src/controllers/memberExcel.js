import xlsx from "xlsx";
import Member from "../models/members.model.js";

// Excel serial date → JS Date
const excelDateToJS = (excelDate) => {
  if (!excelDate || typeof excelDate !== "number") return null;

  const parsed = xlsx.SSF.parse_date_code(excelDate);
  if (!parsed) return null;

  return new Date(parsed.y, parsed.m - 1, parsed.d);
};

export const importMembers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    const membersToInsert = [];

    rows.forEach((row) => {
      // Skip header row
      if (
        row.__EMPTY === "MEMBERSHIP NO." ||
        row.__EMPTY_1 === "MEMBER'S NAME"
      ) return;

      const mapped = {
        personalDetails: {
          membershipNumber: row["CA CO-OPERATIVE THRIFT AND CREDIT SOCIETY LTD"] || "",
          nameOfMember: row.__EMPTY || "",
          nameOfFather: row.__EMPTY_1 || "",
          dateOfBirth: excelDateToJS(row.__EMPTY_2),
          membershipDate: excelDateToJS(row.__EMPTY_3),
          phoneNo: row.__EMPTY_6 || "",
          minor: false,
        },

        addressDetails: {
          permanentAddress: {
            areaStreetSector: row.__EMPTY_4 || "",
            pincode: row.__EMPTY_5 || "",
          },
          previousCurrentAddress: []
        },

        documents: {
          panNo: row.__EMPTY_7 || "",
        }
      };

      membersToInsert.push(mapped);
    });

    const result = await Member.insertMany(membersToInsert);

    return res.status(200).json({
      success: true,
      inserted: result.length
    });

  } catch (error) {
    console.error("Error importing:", error);
    res.status(500).json({ message: "Error importing members", error });
  }
};
