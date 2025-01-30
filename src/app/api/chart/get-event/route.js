import connectDb from "../../../../../config/connectDb";
import Events from "../../../../../models/eventsModel";
export async function GET() {
  const currentDate = new Date();
  currentDate.setDate(1);
  currentDate.setDate(currentDate.getDate() - 1)
  currentDate.setHours(18, 30, 0)
  let d = new Date();
  let endDate = new Date(d);
  d.setDate(1)
  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth() - 1)

  }
  // endDate=monthNames[d.getMonth()]+" "+d.getFullYear()
  d.setMonth(11)
  d.setDate(30)
  d.setHours(18, 30, 0)
  endDate.setMonth(11)
  endDate.setDate(30)
  endDate.setHours(18, 29, 0)
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const startOfDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 18, 30, 0); // Start of yesterday
  // Set time to 11:59:59.999 PM IST
  const startOfDayIST = new Date(today);
  startOfDayIST.setHours(18, 30, 59, 999)
  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  startOfWeek.setHours(18, 30, 0)// Start of the week (Sunday)
  const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));
  endOfWeek.setHours(18, 30, 0)// End of the week (Saturday)
  yesterday.setDate(today.getDate() - 2);
  yesterday.setHours(18, 29, 59, 999)
  today.setDate(today.getDate() - 1);
  startOfDayIST.setHours(18, 29, 59, 999)
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const endOfYear = new Date(new Date().getFullYear(), 11, 31, 18, 29, 59, 999);

  await connectDb()
  const monthdata = await Events.aggregate([
    {
      $match: {
        createdAt: {
          $lte: new Date(),
          $gte: currentDate
        },
      }
    }, {
      $group: {
        _id: "$event",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
          event: "$_id",
          users: "$count"

        // Get the count of orderItems
      }
    }
  ])
  const yeardata = await Events.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfYear, $lte: endOfYear },
      }
    },
    {
      $group: {
        _id: "$event",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
          event: "$_id",
          users: "$count"


        // Get the count of orderItems
      }
    }
  ])
  const todaydata = await Events.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfDay,
          $lte: startOfDayIST
        },


      }
    },
    {
      $group: {
        _id: "$event",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
          event: "$_id",
          users: "$count"





      }
    }
  ]);
  const weekdata = await Events.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfWeek,
          $lte: endOfWeek
        },
      }
    },
    {
      $group: {
        _id: "$event",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
          event: "$_id",
          users: "$count"




        // Get the count of orderItems
      }
    }
  ]);
  const yesterdaydata = await Events.aggregate([
    {
      $match: {
        createdAt: {
          $gte: yesterday,
          $lte: startOfDay
        },

      }
    },
    {
      $group: {
        _id: "$event",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
          event: "$_id",
          users: "$count"




        // Get the count of orderItems
      }
    }
  ]);

  return Response.json({
    monthdata, yeardata, todaydata, weekdata, yesterdaydata
  })
}
