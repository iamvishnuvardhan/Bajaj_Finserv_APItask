const express = require("express");
const app = express();

// To handle large JSON input
app.use(express.json({ limit: '50mb' }));

app
  .route("/bfhl")
  .get((req, res) => {
    res.status(200).json({ operation_code: 1 });
  })
  .post((req, res) => {
    const { data, file_b64 } = req.body || [];
    const numbers = [];
    const alphabets = [];
    let highest_lowercase_alphabet = "";
    
    // Process the "data" field to separate numbers and alphabets
    for (const item of data) {
      if (!isNaN(item)) {
        numbers.push(item);
      } else if (item.length === 1 && isNaN(item)) {
        alphabets.push(item);
        // Check if it's lowercase and higher than the current highest lowercase alphabet
        if (item === item.toLowerCase() && item > highest_lowercase_alphabet) {
          highest_lowercase_alphabet = item;
        }
      }
    }

    // Validate the file using Base64
    let file_valid = false;
    let file_mime_type = "";
    let file_size_kb = 0;

    if (file_b64) {
      try {
        const fileBuffer = Buffer.from(file_b64, 'base64');
        file_size_kb = (fileBuffer.length / 1024).toFixed(2); // Calculate file size in KB

        // Assuming the MIME type is in the file header, a mock example:
        file_mime_type = "application/octet-stream"; // You can improve MIME detection logic
        
        // For simplicity, if we have a valid Base64 string, we mark the file as valid
        file_valid = true;
      } catch (error) {
        file_valid = false;
      }
    }

    res.json({
      is_success: true,
      user_id: "sanhita_kundu_17091999", // Format the user_id as "fullname_ddmmyyyy"
      email: "sanhita.kundu2020@vitstudent.ac.in",
      roll_number: "20BEC0215",
      numbers,
      alphabets,
      highest_lowercase_alphabet: highest_lowercase_alphabet ? [highest_lowercase_alphabet] : [],
      file_valid,
      file_mime_type,
      file_size_kb
    });
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
