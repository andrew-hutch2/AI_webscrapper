import React, {useState, useEffect} from 'react'
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, ChartOptions } from 'chart.js'

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
      data: [],
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
  const [isLoading, setIsLoading] = useState(false);
  const [chartOptions, setChartOptions] = useState<ChartOptions>({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 16
        },
        bodyFont: {
          size: 14
        },
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            size: 14,
            weight: '500'
          },
          padding: 10
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          font: {
            size: 14,
            weight: '500'
          },
          padding: 10
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  });

  useEffect(() => {
    if (chatResponse !== '') {
      setIsLoading(true);
      try {
        let dataArray = JSON.parse(chatResponse);
        setInsight(dataArray.insight);
        setCharttype(inputChartType);
        setData(dataArray.chart.data);
        setTitle(dataArray.title);
      } catch (error) {
        console.error('Error parsing chatResponse:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [chatResponse, inputChartType])

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    switch (charttype.toLowerCase()) {
      case "bar":
        return <Bar data={data} options={chartOptions} />
      case "pie":
        return <Pie data={data} options={chartOptions} />
      case "line":
        return <Line data={data} options={chartOptions} />
      case "scatter":
        return <Scatter data={data} options={chartOptions} />
      case "table":
        const headers = data.labels;
        const rows = data.datasets[0].data;
        return (
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-gray-700 bg-gray-800">
              <thead className="bg-gray-700">
                <tr>
                  {headers.map((header: string, index: number) => (
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" 
                      key={index}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {rows.map((row: number[], rowIndex: number) => (
                  <tr 
                    key={rowIndex}
                    className="hover:bg-gray-700 transition-colors duration-150"
                  >
                    {row.map((cell: number, cellIndex: number) => (
                      <td 
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-300" 
                        key={cellIndex}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
        {insight && (
          <p className="text-gray-300 text-lg leading-relaxed">{insight}</p>
        )}
      </div>
      
      <div className="relative h-[500px] w-full">
        {renderChart()}
      </div>
    </div>
  )
}

export default ChartComponent