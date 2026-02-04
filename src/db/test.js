const { query } = require("./index");

async function test() {
  const res = await query("SELECT NOW()");
  console.log(res.rows);
  process.exit(0);
}

test();
