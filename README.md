src/
│
├── main.ts                     # Archivo principal para iniciar la aplicación Nest.js
├── app.module.ts               # Módulo principal de la aplicación
│
├── modules/                    # Módulos organizados por dominio
│   ├── products/               # Módulo de productos
│   │   ├── dto/                # Data Transfer Objects (validación)
│   │   │   ├── create-product.dto.ts
│   │   │   └── update-product.dto.ts
│   │   ├── entities/           # Entidades TypeORM
│   │   │   └── product.entity.ts
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   └── products.module.ts
│   │
│   ├── chatbot/                # Módulo del chatbot
│   │   ├── chatbot.controller.ts
│   │   ├── chatbot.service.ts
│   │   └── chatbot.module.ts
│   │
│   ├── cart/                   # Módulo del carrito de compras
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── cart.controller.ts
│   │   ├── cart.service.ts
│   │   └── cart.module.ts
│   │
│   └── orders/                 # Módulo de pedidos
│       ├── dto/
│       ├── entities/
│       ├── orders.controller.ts
│       ├── orders.service.ts
│       └── orders.module.ts
│
├── common/                     # Código reutilizable
│   ├── decorators/             # Decoradores personalizados
│   ├── filters/                # Filtros de excepciones globales
│   ├── interceptors/           # Interceptores
│   ├── pipes/                  # Pipes personalizados
│   └── utils/                  # Utilidades generales
│
├── config/                     # Configuración de la aplicación
│   ├── database.config.ts      # Configuración de TypeORM
│   └── chatbot.config.ts       # Configuración del chatbot
│
└── test/                       # Pruebas unitarias y de integración
    ├── products/               # Pruebas del módulo de productos
    ├── chatbot/                # Pruebas del módulo del chatbot
    └── ...