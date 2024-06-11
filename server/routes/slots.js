const router = require("express").Router();
const pool = require("../db");

router.post("/addslots",async (req,res) => {
    try {
        const  {activity_type,start_time,end_time,max_participants,farm_id} = req.body;
        await pool.query("INSERT INTO slots(activity_type,start_time,end_time,max_participants,farm_id) VALUES($1,$2,$3,$4,$5)",[activity_type,start_time,end_time,max_participants,farm_id]);
        res.status(200).json({success:true});
        
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
})

// router.get("/slots",async(req,res) => {
//   try {
//     const slotArray = [];
//     const slot = await pool.query("SELECT id from slots where farm_id = $1",[id]);
//     slotArray.push(slot);
//     res.json({slotArray});
    
//     res.status(200).json({success:true});
    
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("server error");
//   }
// })

// router.get("/slotinfo",async(req,res) => {
//   try {
//     const id = req.body;
//     const slotinfo = await pool.query("SELECT * from slots where id = $1",[id]);
//     res.json(slotinfo.rows[0]);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("server error");
//   }
// })



router.get("/combinedslots", async (req, res) => {
  try {
    const { farm_id } = req.query; 
    if (!farm_id) {
      return res.status(400).json({ error: "farm_id is required" });
    }

    // Step 1: Retrieve slot IDs
    const slotIdsResult = await pool.query("SELECT id FROM slots WHERE farm_id = $1", [farm_id]);
    const slotIds = slotIdsResult.rows.map(row => row.id);

    if (slotIds.length === 0) {
      return res.status(200).json({ slots: [] });
    }

    const slotsInfo = [];
    for (const id of slotIds) {
      const slotInfoResult = await pool.query("SELECT * FROM slots WHERE id = $1", [id]);
      if (slotInfoResult.rows.length > 0) {
        slotsInfo.push(slotInfoResult.rows[0]);
      }
    }

    res.status(200).json({ slots: slotsInfo });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});


router.get("/getbookedslots", async (req, res) => {
  try {
    const { farm_id } = req.query;
  
    const slotsResult = await pool.query("SELECT * FROM bookings WHERE farm_id = $1", [farm_id]);

    res.status(200).json({ slots: slotsResult.rows });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
router.get("/getslots", async (req, res) => {
  try {
    const { farm_id } = req.query;
  
    const slotsResult = await pool.query("SELECT * FROM slots WHERE farm_id = $1", [farm_id]);

    res.status(200).json({ slots: slotsResult.rows });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.post("/approveslot", async (req, res) => {
  try {
      const { id } = req.body;

      // Update the status of the slot to 'scheduled'
      const result = await pool.query(
          "UPDATE bookings SET status = 'scheduled' WHERE id = $1 RETURNING *",
          [id]
      );

      if (result.rowCount === 0) {
          return res.status(404).json({ error: "Slot not found" });
      }

      res.json({ message: "Slot approved", slot: result.rows[0] });
  } catch (error) {
      console.error("Error approving slot:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/rejectslot", async (req, res) => {
  try {
      const { id } = req.body;

      // Update the status of the slot to 'not scheduled'
      const result = await pool.query(
          "UPDATE bookings SET status = 'not scheduled' WHERE id = $1 RETURNING *",
          [id]
      );

      if (result.rowCount === 0) {
          return res.status(404).json({ error: "Slot not found" });
      }

      res.json({ message: "Slot rejected", slot: result.rows[0] });
  } catch (error) {
      console.error("Error rejecting slot:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/bookslot", async (req,res) => {
  try {
      const {user_id,slot_id,username,semail,phone_number,farm_id} = req.body;
      await pool.query("INSERT INTO bookings(user_id,slot_id,username,email,phone_number,farm_id) VALUES($1,$2,$3,$4,$5,$6)",[user_id,slot_id,username,semail,phone_number,farm_id]);
      res.status(200).json({success:true});
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
})





module.exports = router;

// id SERIAL PRIMARY KEY,
// activity_type VARCHAR(255),
// start_time TIMESTAMP NOT NULL,
// end_time TIMESTAMP NOT NULL,
// max_participants INTEGER NOT NULL,
// current_participants INTEGER DEFAULT 0,
// farm_id INTEGER REFERENCES public.farms(id),
// FOREIGN KEY (farm_id) REFERENCES public.farms(id)