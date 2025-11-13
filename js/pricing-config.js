// Configuración de precios por sistema
const pricingConfig = {
    plomeria: {
        name: "Plomería",
        icon: "🚰",
        color: "#0066cc",
        colorDark: "#0052a3",
        plans: {
            basic: {
                name: "Básico",
                price: 29,
                users: 1,
                features: ["Panel de control", "Gestión básica de trabajos", "1 usuario"]
            },
            professional: {
                name: "Profesional",
                price: 79,
                users: 5,
                features: ["Todo lo anterior", "Gestión de clientes", "Hasta 5 usuarios", "Presupuestos"]
            },
            enterprise: {
                name: "Empresarial",
                price: 149,
                users: 15,
                features: ["Todo lo anterior", "Gestión de contratistas", "Hasta 15 usuarios", "Seguimiento GPS"]
            },
            premium: {
                name: "Premium",
                price: 299,
                users: Infinity,
                features: ["Todo lo anterior", "Portal de proveedores", "Usuarios ilimitados", "Integraciones de pago", "Soporte 24/7"]
            }
        }
    },
    jardineria: {
        name: "Jardinería",
        icon: "🌿",
        color: "#00aa44",
        colorDark: "#008a3a",
        plans: {
            basic: {
                name: "Básico",
                price: 25,
                users: 1,
                features: ["Panel de control", "Gestión de proyectos", "1 usuario"]
            },
            professional: {
                name: "Profesional",
                price: 65,
                users: 5,
                features: ["Todo lo anterior", "Gestión de clientes", "Hasta 5 usuarios", "Programación"]
            },
            enterprise: {
                name: "Empresarial",
                price: 125,
                users: 15,
                features: ["Todo lo anterior", "Equipo de jardineros", "Hasta 15 usuarios", "Inventario de plantas"]
            },
            premium: {
                name: "Premium",
                price: 249,
                users: Infinity,
                features: ["Todo lo anterior", "Gestión de proveedores", "Usuarios ilimitados", "Integración de pagos", "Soporte 24/7"]
            }
        }
    },
    logistica: {
        name: "Logística",
        icon: "📦",
        color: "#ff8800",
        colorDark: "#dd7000",
        plans: {
            basic: {
                name: "Básico",
                price: 35,
                users: 1,
                features: ["Panel de control", "Gestión de envíos", "1 usuario"]
            },
            professional: {
                name: "Profesional",
                price: 89,
                users: 5,
                features: ["Todo lo anterior", "Gestión de clientes", "Hasta 5 usuarios", "Rutas de entrega"]
            },
            enterprise: {
                name: "Empresarial",
                price: 169,
                users: 15,
                features: ["Todo lo anterior", "Gestión de conductores", "Hasta 15 usuarios", "GPS en tiempo real"]
            },
            premium: {
                name: "Premium",
                price: 329,
                users: Infinity,
                features: ["Todo lo anterior", "Gestión de proveedores", "Usuarios ilimitados", "Integraciones de pago", "Soporte 24/7"]
            }
        }
    },
    mudanza: {
        name: "Mudanza",
        icon: "🚚",
        color: "#cc00ff",
        colorDark: "#9900cc",
        plans: {
            basic: {
                name: "Básico",
                price: 31,
                users: 1,
                features: ["Panel de control", "Gestión de mudanzas", "1 usuario"]
            },
            professional: {
                name: "Profesional",
                price: 81,
                users: 5,
                features: ["Todo lo anterior", "Gestión de clientes", "Hasta 5 usuarios", "Presupuestos"]
            },
            enterprise: {
                name: "Empresarial",
                price: 151,
                users: 15,
                features: ["Todo lo anterior", "Equipo de mudanzas", "Hasta 15 usuarios", "Seguimiento en vivo"]
            },
            premium: {
                name: "Premium",
                price: 301,
                users: Infinity,
                features: ["Todo lo anterior", "Gestión de proveedores", "Usuarios ilimitados", "Integraciones de pago", "Soporte 24/7"]
            }
        }
    }
};

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = pricingConfig;
}
