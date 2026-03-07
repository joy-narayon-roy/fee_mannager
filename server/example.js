const { default: mongoose } = require("mongoose");
const { Fee } = require("./src/models");

async function main() {
  try {
    await mongoose.connect("");
    const fees = await Fee.find({
      status: "Unpaid",
      due_amount: {
        $eq: 0,
      },
    });
    const updated_fees = fees.map((f) => {
      f.due_amount = f.total_amount - (f.discount + f.paid_amount);
      return f;
    });

    for (const updated_fee of updated_fees) {
      await updated_fee.save();
      console.log(updated_fee);
    }
    // console.log(fees);
    console.log(fees.length);
    mongoose.connection.close();
  } catch (err) {
    console.log("Error");
    console.log(err);
  }
}

main();
