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
        position: 'bottom' as const
      },
      title: {
        display: false,
        text: 'Chart.js Chart'
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 24 // Change x-axis text size
          }
        }
      },
      y: {
        ticks: {
          font: {
            size: 16 // Change y-axis text size
          }
        }
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
      case "table":
        const headers = data.labels;
        const rows = data.datasets[0].data;
        return (
          <table className='min-w-full m-10 table-fixed divide-y divide-gray-200 '>
            <thead>
              <tr>
                {headers.map((header: string, index: number) => (
                  <th className="px-2 text-left text-xl font-medium text-gray-500 uppercase tracking-wider" key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className=' divide-y divide-gray-400'>
              {rows.map((row: number[], rowIndex: number) => (
                <tr key={rowIndex}>
                  {row.map((cell: number, cellIndex: number) => (
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-200" key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  }

  return (
    <div>
    {      /*<h1>{title}</h1>
      <p>{JSON.stringify(data)}</p>
      <p>{charttype}</p>*/
    }
      <h1> {title} </h1>
      <p>{insight}</p>
      
      <div className='m-10'>
        {renderChart()}
      </div>
    </div>
  )
}
export default ChartComponent