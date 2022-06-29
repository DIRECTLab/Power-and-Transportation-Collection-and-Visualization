import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const CustomChart = ({ labels, data }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "EVR Load (In KiloWatt)",
        data,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: 'rgba(75,192,192,0.1)',
        fill: true,
      },
    ],
  }

  return (
    <Line data={chartData} options={{ maintainAspectRatio: false }} height="100%" />
  )
}

export default CustomChart;