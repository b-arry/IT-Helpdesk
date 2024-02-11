const Ticket = require("../models/ticket");

async function getOpenTicketsCount() {
  try {
    const openTicketsCount = await Ticket.countDocuments({ status: "open" });
    return openTicketsCount;
  } catch (err) {
    console.error("Error fetching data:", err);
    return -1;
  }
}

async function getClosedTicketsCount() {
  try {
    const closedTicketsCount = await Ticket.countDocuments({
      status: "closed",
    });
    return closedTicketsCount;
  } catch (err) {
    console.error("Error fetching data:", err);
    return -1;
  }
}
async function getInProgressTicketsCount() {
  try {
    const inProgressTicketsCount = await Ticket.countDocuments({
      status: "in progress",
    });
    return inProgressTicketsCount;
  } catch (err) {
    console.error("Error fetching data:", err);
    return -1;
  }
}
async function getAverageTimeToCloseTickets() {
  try {
    const resolvedTickets = await Ticket.find({ status: 'closed', closedAt: { $exists: true } });

    if (resolvedTickets.length === 0) {
      return 0; // No closed tickets or closure timestamps
    }

    const closureTimes = resolvedTickets.map(ticket => ticket.closedAt - ticket.createdAt);
    const totalClosureTimeInMillis = closureTimes.reduce((acc, time) => acc + time, 0);
    const averageClosureTimeInMillis = totalClosureTimeInMillis / resolvedTickets.length;
    const averageClosureTimeInHours = averageClosureTimeInMillis / (1000 * 60 * 60);

    return averageClosureTimeInHours.toFixed(2); // Keep two decimal places
  } catch (err) {
    console.error('Error fetching data:', err);
    return -1;
  }
}

const calculatePercentage = (closedTickets, totalTickets) => {
  return ((closedTickets / totalTickets) * 100).toFixed(2);
};


const calculateMonthlyPercentage = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const pipeline = [
      {
        $match: {
          status: 'closed', // Assuming your ticket model has a 'status' field to indicate ticket status
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$closedDate' }, // Assuming your ticket model has a 'closedDate' field to store the date when the ticket was closed
            year: { $year: '$closedDate' }, // Assuming your ticket model has a 'closedDate' field to store the date when the ticket was closed
          },
          closedTickets: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          year: '$_id.year',
          closedTickets: 1,
        },
      },
    ];

    const monthlyClosedTickets = await Ticket.aggregate(pipeline);

    // Calculate the total closed tickets for each month
    const monthlyTotals = monthlyClosedTickets.reduce((acc, { month, closedTickets }) => {
      acc[month] = (acc[month] || 0) + closedTickets;
      return acc;
    }, {});

    // Calculate the total closed tickets across all months
    const totalClosedTickets = monthlyClosedTickets.reduce((acc, { closedTickets }) => {
      acc += closedTickets;
      return acc;
    }, 0);

    // Calculate the percentage of closed tickets for each month
    const monthlyPercentage = monthlyClosedTickets.map(({ month, year, closedTickets }) => ({
      month,
      year,
      closedTickets,
      percentage: calculatePercentage(closedTickets, monthlyTotals[month]),
    }));

    // Calculate the monthly percentage of increase and decrease
    const monthlyPercentageChange = monthlyPercentage.map(({ month, year, closedTickets, percentage }) => {
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      const prevClosedTickets = monthlyTotals[prevMonth];
      const prevPercentage = prevClosedTickets ? calculatePercentage(closedTickets, prevClosedTickets) : 0;
      const percentageChange = (percentage - prevPercentage).toFixed(2);
     
      return {
        month,
        year,
        closedTickets,
        percentage,
        percentageChange,
      };
    });

   

    return {'percentChange':monthlyPercentageChange[0]['percentageChange']};
  } catch (error) {
    console.error(error);
    return 'Internal server error'; 
  }
};


module.exports = { getOpenTicketsCount, getClosedTicketsCount, getInProgressTicketsCount, getAverageTimeToCloseTickets,calculateMonthlyPercentage };  