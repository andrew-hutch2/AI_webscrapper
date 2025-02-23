import React, {useState, useEffect} from 'react'
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement)

interface ChartProps {
  chatResponse: string
  inputChartType: string
}

const chartData = {
  labels: [],
  datasets: [
    {
      label: "",
      data : [],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }
  ]
}
  
const ChartComponent: React.FC<ChartProps> = ({ chatResponse, inputChartType }) => {
  const [insight, setInsight] = useState(""); 
  const [charttype, setCharttype] = useState("");
  const [data, setData] = useState(chartData);
  const [title, setTitle] = useState("Chart Title");
  useEffect(() => {
    if (chatResponse !== '') {
      try {

        let dataArray = JSON.parse(chatResponse);
        setInsight(dataArray.insight);
        setCharttype(inputChartType);
        setData(dataArray.chart.data);
        setTitle('Chart Title');
        console.log(dataArray);
      } catch (error) {
        console.error('Error parsing chatResponse:', error);
        console.error('chatResponse:', chatResponse);
      }
    }
    
  }, [chatResponse, inputChartType])



  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart'
      }
    }
  }

  const renderChart = () => {
    switch (charttype.toLowerCase()) {
      case "bar":
        return <Bar data={data} options={options} />
      case "pie":
        return <Pie data={data} options={options} />
      case "line":
        return <Line data={data} options={options} />
      case "scatter":
        return <Scatter data={data} options={options} />
      default:
        return null;
    }
  }

  return (
    <div>
      <h1>{title}</h1>
      <p>{JSON.stringify(data)}</p>
      <p>{charttype}</p>
      <p>{insight}</p>
      
      {renderChart()}
    </div>
  )
}
export default ChartComponent