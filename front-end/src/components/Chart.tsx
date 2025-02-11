// src/components/Chart.tsx
import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
} from "recharts";

// Definimos os tipos de gráficos suportados
type ChartType = "line" | "bar" | "area";

// Definimos as propriedades que nosso componente aceita
interface ChartProps {
  // Dados que serão visualizados no gráfico
  data: any[];
  // Tipo do gráfico (linha, barra ou área)
  type?: ChartType;
  // Chave dos dados para o eixo X
  xAxisKey?: string;
  // Chave dos dados para o eixo Y
  yAxisKey?: string;
  // Altura do gráfico
  height?: number;
  // Cor principal do gráfico
  color?: string;
  // Título do gráfico (opcional)
  title?: string;
  // Mostrar grade de fundo
  showGrid?: boolean;
}

export function Chart({
  data,
  type = "line",
  xAxisKey = "name",
  yAxisKey = "value",
  height = 300,
  color = "#0ea5e9",
  title,
  showGrid = true,
}: ChartProps) {
  // Estado para controlar o item destacado no hover
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Configuração comum para todos os tipos de gráficos
  const commonProps = {
    data,
    margin: { top: 10, right: 30, left: 0, bottom: 0 },
  };

  // Renderiza o gráfico apropriado baseado no tipo
  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis
              dataKey={xAxisKey}
              tick={{ fill: "#6B7280" }}
              tickLine={{ stroke: "#6B7280" }}
            />
            <YAxis
              tick={{ fill: "#6B7280" }}
              tickLine={{ stroke: "#6B7280" }}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey={yAxisKey}
              stroke={color}
              strokeWidth={2}
              dot={{ r: 4, fill: color }}
              activeDot={{ r: 6, fill: color }}
            />
          </LineChart>
        );

      case "bar":
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar
              dataKey={yAxisKey}
              fill={color}
              radius={[4, 4, 0, 0]}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === activeIndex ? darkenColor(color, 0.2) : color}
                />
              ))}
            </Bar>
          </BarChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Area
              type="monotone"
              dataKey={yAxisKey}
              stroke={color}
              fill={`${color}33`}
              strokeWidth={2}
            />
          </AreaChart>
        );
    }
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      )}
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>{renderChart()}</ResponsiveContainer>
      </div>
    </div>
  );
}

// Função auxiliar para escurecer cores (para efeito hover)
function darkenColor(color: string, amount: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const r = Math.floor((num >> 16) * (1 - amount));
  const g = Math.floor(((num >> 8) & 0x00ff) * (1 - amount));
  const b = Math.floor((num & 0x0000ff) * (1 - amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
