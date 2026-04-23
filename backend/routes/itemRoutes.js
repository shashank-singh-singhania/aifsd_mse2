const express = require("express");
const Item = require("../models/Item");
const auth = require("../middleware/auth");

const router = express.Router();

// ADD ITEM
router.post("/", auth, async (req, res) => {
  const item = new Item({ ...req.body, user: req.user.id });
  await item.save();
  res.json(item);
});

// GET ALL
router.get("/", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// GET BY ID
router.get("/:id", async (req, res) => {
  const item = await Item.findById(req.params.id);
  res.json(item);
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (item.user.toString() !== req.user.id)
    return res.status(403).json({ msg: "Unauthorized" });

  Object.assign(item, req.body);
  await item.save();

  res.json(item);
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (item.user.toString() !== req.user.id)
    return res.status(403).json({ msg: "Unauthorized" });

  await item.deleteOne();
  res.json({ msg: "Deleted" });
});

// SEARCH
router.get("/search/:name", async (req, res) => {
  const items = await Item.find({
    itemName: { $regex: req.params.name, $options: "i" }
  });
  res.json(items);
});

module.exports = router;