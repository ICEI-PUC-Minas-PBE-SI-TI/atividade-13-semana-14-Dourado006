document.addEventListener('DOMContentLoaded', carregarDadosGrafico);

async function carregarDadosGrafico() {
    try {
        const response = await fetch('http://localhost:3000/projetos');
        const projetos = await response.json();

        // 1. Puxar os Títulos dos carros para as categorias do eixo X
        const labels = projetos.map(projeto => projeto.titulo);

        // 2. Extrair apenas os números da "potencia" (Ex: "350 cv" vira 350) para o eixo Y
        const dadosPotencia = projetos.map(projeto => {
            // Regex para buscar apenas os dígitos
            const numeros = projeto.potencia ? projeto.potencia.match(/\d+/) : null;
            return numeros ? parseInt(numeros[0]) : 0; 
        });

        // 3. Renderizar o gráfico usando o Chart.js
        const ctx = document.getElementById('potenciaChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'bar', // Gráfico de barras
            data: {
                labels: labels,
                datasets: [{
                    label: 'Potência Estimada (CV)',
                    data: dadosPotencia,
                    backgroundColor: 'rgba(255, 193, 7, 0.8)', // Amarelo (Warning Bootstrap)
                    borderColor: 'rgba(253, 126, 20, 1)',      // Laranja borda
                    borderWidth: 2,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: { color: '#ffffff' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#ffffff' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#ffffff' },
                        grid: { display: false }
                    }
                }
            }
        });

    } catch (error) {
        console.error("Erro ao gerar o gráfico:", error);
        alert("Erro ao carregar o gráfico. Verifique se o json-server está rodando.");
    }
}