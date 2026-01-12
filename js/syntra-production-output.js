/**
 * Syntra Production Output Card
 * Displays active production capabilities and purity specifications
 */

class ProductionOutputCard {
    constructor() {
        this.materials = [
            {
                symbol: 'Li',
                name: 'LITHIUM',
                grade: 'Battery Grade',
                purity: '99.5%'
            },
            {
                symbol: 'Ni',
                name: 'NICKEL',
                grade: 'Purity',
                purity: 'High'
            },
            {
                symbol: 'Co',
                name: 'COBALT',
                grade: 'Purity',
                purity: 'High'
            },
            {
                symbol: 'Mn',
                name: 'MANGANESE',
                grade: 'Purity',
                purity: 'High'
            },
            {
                symbol: 'Al',
                name: 'ALUMINUM',
                grade: 'Precursor',
                purity: '>99%'
            },
            {
                symbol: 'Cu',
                name: 'COPPER',
                grade: 'Cathode',
                purity: '>99%'
            }
        ];
    }

    render() {
        return `
            <div class="w-full max-w-[520px] bg-white rounded-sm shadow-xl overflow-hidden border border-syntra-border">
                <!-- Accent Bar -->
                <div class="h-1.5 bg-gradient-to-r from-syntra-accent via-yellow-400 to-syntra-accent"></div>

                <!-- Header -->
                <div class="px-6 py-5 border-b border-syntra-border bg-syntra-base">
                    <div class="flex items-start justify-between">
                        <div>
                            <h3 class="font-head text-xl font-bold text-syntra-text uppercase tracking-tight leading-tight">Production Output</h3>
                            <p class="font-mono text-[10px] text-syntra-muted tracking-widest uppercase mt-1.5">Active Capabilities</p>
                        </div>
                        <div class="flex flex-col items-end gap-1">
                            <div class="flex items-center gap-2">
                                <span class="relative flex h-2 w-2">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                            </div>
                            <span class="font-mono text-[10px] text-green-600 font-bold tracking-wider">ONLINE</span>
                        </div>
                    </div>
                </div>

                <!-- Materials Grid -->
                <div class="p-6 grid grid-cols-2 gap-4 bg-white">
                    ${this.materials.map((material, index) => `
                        <div class="group bg-syntra-base border border-syntra-border rounded-sm p-4 hover:border-syntra-accent hover:shadow-md transition-all duration-300">
                            <div class="flex items-start justify-between mb-3">
                                <span class="font-head text-3xl font-bold text-syntra-text group-hover:text-syntra-amber transition-colors">${material.symbol}</span>
                                <span class="font-mono text-sm font-bold text-syntra-amber group-hover:text-syntra-accent transition-colors">${material.purity}</span>
                            </div>
                            <div>
                                <h4 class="font-mono text-xs text-syntra-tech uppercase tracking-wide mb-1">${material.name}</h4>
                                <p class="font-mono text-[10px] text-syntra-muted uppercase tracking-wider">${material.grade}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Footer -->
                <div class="px-6 py-5 border-t border-syntra-border bg-syntra-base">
                    <button onclick="window.location.href='index.html#partner-ecosystem-access'" class="w-full font-mono text-xs text-syntra-tech uppercase tracking-widest hover:text-syntra-amber transition-colors duration-300 text-center font-medium">
                        Request Technical Data Sheets
                    </button>
                </div>
            </div>
        `;
    }
}

// Initialize and render production output card
function initProductionOutputCard(containerId = 'production-output-card') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`ProductionOutputCard: Container with id "${containerId}" not found`);
        return;
    }

    const card = new ProductionOutputCard();
    container.innerHTML = card.render();
}

// Auto-initialize on page load
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const container = document.getElementById('production-output-card');
            if (container) {
                initProductionOutputCard();
            }
        });
    } else {
        const container = document.getElementById('production-output-card');
        if (container) {
            initProductionOutputCard();
        }
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProductionOutputCard, initProductionOutputCard };
}
