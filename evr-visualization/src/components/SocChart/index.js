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

const SocChart = ({ labels, data, name }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: name,
        data,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: 'rgba(75,192,192,0.1)',
        fill: true,
      },
    ],
  }

  return (
    <Line data={chartData} />
  )
}

export default SocChart;