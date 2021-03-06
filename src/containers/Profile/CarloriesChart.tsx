import React, {memo} from "react";
import {Container} from "reactstrap";
import {Bar} from "react-chartjs-2";
import moment from "moment";

import {Round} from "../../types";

interface CalaroriesChartProps {
  rounds: Array<Round>;
}

const CalaroriesChart: React.FC<CalaroriesChartProps> = ({rounds}) => {
  const DATA_POINT_COUNTS = 15;
  const dates = Array.from({length: DATA_POINT_COUNTS}).map((_, idx) => {
    const date = new Date();
    date.setDate(date.getDate() - DATA_POINT_COUNTS + idx + 1);
    return date;
  });

  const data = {
    labels: dates.map((date) => date.toLocaleDateString()),
    datasets: [
      {
        type: "line",
        label: "Minimum Speed",
        backgroundColor: "rgba(210, 52, 190, 0.5)",
        yAxisID: "y-axis-2",
        borderColor: "rgba(210, 52, 190, 0.8)",
        data: dates.map((date) => {
          const validRounds = rounds.filter((round) =>
              moment(round.startAt).isSame(moment(date), "date")
          );
          const totalMinSpeed = validRounds.reduce(
              (a, b) => a + b.minKmPerHour,
              0
          );
          return totalMinSpeed / validRounds.length;
        }),
      },
      {
        type: "line",
        label: "Maximum Speed",
        backgroundColor: "rgba(129, 149, 231, 0.5)",
        yAxisID: "y-axis-2",
        borderColor: "rgba(129, 149, 231, 0.8)",
        data: dates.map((date) => {
          const validRounds = rounds.filter((round) =>
              moment(round.startAt).isSame(moment(date), "date")
          );
          const totalMaxSpeed = validRounds.reduce(
              (a, b) => a + b.maxKmPerHour,
              0
          );
          return totalMaxSpeed / validRounds.length;
        }),
      },
      {
        label: "Calories",
        backgroundColor: "rgba(169, 221, 57, 0.5)",
        borderColor: "rgba(169, 221, 57, 0.8)",
        data: dates.map((date) => {
          return rounds.reduce((sum, round) => {
            const add = moment(round.startAt).isSame(moment(date), "date")
                ? round.calories
                : 0;
            return sum + add;
          }, 0);
        }),
      },
    ],
  };
  return (
      <Container>
        <Bar
            data={data}
            options={{
              scales: {
                xAxes: [
                  {
                    position: "bottom",
                    gridLines: {zeroLineColor: "rgba(0,0,0,1)"},
                  },
                ],
                yAxes: [
                  {
                    type: "linear",
                    display: true,
                    position: "left",
                    id: "y-axis-1",
                  },
                  {
                    type: "linear",
                    display: true,
                    position: "right",
                    id: "y-axis-2",
                  },
                ],
              },
            }}
        />
      </Container>
  );
};

export default memo(CalaroriesChart);
