# StreamingServicesApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.0.

## Instrucciones de ejecución

Luego de clonar el repositorio, ejecutar el comando `npm install`
Una vez terminado, ejecutar `npm start` para ejecutar el proyecto

## SOLID

### Single Responsability
Se crea una clase para cada repositorio, factoría, service, de manera que cada uno cumpla con su respectiva función, sin cargar con tareas que le correspondan a otros objectos. 
![image](https://github.com/user-attachments/assets/c30016cc-9a16-4c75-ae1b-43d98af2cab3)

### Open/Close
Se implementa el manejo de conceptos de programación orientada a objetos como herencia, se aplica el patrón de diseño Strategy y factorías, con el objectivo de hacer el código escalable. 

Se cuenta con la clase base Subscription, de la cuál se heredan MonthlySubscription, YearlySubscription (Que a su vez hereda de PartiallyRefundableSubscription). En el momento se cuenta con que la subscripción anual es reembolsable, sin embargo, más adelante, se pueden añadir otros tipos de subscripciones que apliquen para reeembolso. Se crearía una nueva clase que herede de PartiallyRefundableSubscription y ya se definiría su comportamiento. 

Patrón de diseño Factory, para devolver las instancias correctas de Subscription según la frecuencia de pago. 

Patrón de diseño Strategy. Se crea Strategia DiscountStrategy que permite calcular el descuento a aplicar si se realiza subscripción anual. En el momento se cuenta con implementación de una estrategia para subscripción anual (YearlyDiscountStrategy). Si más adelante se desea aplicar diferentes tipos de descuento para otros tipos de subsripciones, se crearía la respectiva Estrategia que satisfaga con dicha necesidad. Evitando modificar el código ya existente y sólo añadiendo la nueva funcionalidad.

### Sustitución de Liskov.
Las clases MonthlySubscription, YearlySubscription y PartiallyRefundableSubscription pueden comportarse perfectamente como su clase padre Subscription sin afectar la funcionalidad de esta última. Esto se puede ver en SubscriptionService, donde sólo se hace uso de la clase Subscription aunque internamenta esta puede tener refencias de sus hijas.

### Segregación de Interfaz.
Se crea la clase PartiallyRefundableSubscription, ya que este define si una subscription aplica para reembolso parcial. Se debe realizar la lógica para calcular los meses restantes de la subscripción y calcular el valor parcial, esto conlleva la creación de un método calculatePartialRefund() que si se creara en la clase Subscription, MonthlySubscription no tendría implementación en dicho método. al agregar PartiallyRefundableSubscription, se soluciona este inconveniente. Se separa a través de una interfaz este comportamiento. No se aplica sobre YealySubscription, ya que si más adelante se agrega, por ejemplo, BiannualSubscription, esta también podría ser reembolsable y esto generaría conflictos con la clase YealySubscription. Al segregar interfaces más pequeñas, se puede tener un código más escalable.

### Inversión de dependencias
En angular, no se puede inyectar directamente una clase abstracta o interfaz dentro de otra clase tal como se hace en C#. Aunque no se aplico a fondo el uso de interfaces por esta limitante, se entiende el objetivo del principio y esto se realizaría sin lugar a dudas en proyectos como C#. 

## Patrones de diseño

Como se mencionó anteriormente, se usaron Factory y Strategy. Factory de tipo creacional para devolver las instancias necesarias de la clase Subscription. Strategy de tipo comportamiento para definir la lógica del cálculo del descuento anual.

## Arquitectura limpia y DDD
Se divide elproyecto en las siguientes capas: 
![image](https://github.com/user-attachments/assets/d7fa7163-a98e-42bb-8dd5-b069097f233a)


- Dominio: Modelos y reglas de negocio, en esta capa se crearon los model(Entidades), Factory, Strategies, Enums. Estos objectos sólo son accedidos a través de la la capa de Aplicación e Infraestructura. 

- Aplicación: Casos de uso (por ejemplo, suscribirse, cancelar, actualizar). En esta capa se implementan los casos de uso de Crear Subscripción, Cancelar y Cambiar subscripción (Véase SubscriptionService). Se añaden otros dos Service más (CustomerService y PlanService) con el objectivo de entregar información a la capa de presentación, haciendo el respectivo uso de DTO para no violar con la arquitectura en capas. 

- Infraestructura: Se crean las clases SubscriptionRepository, CustomerRepository, PlanRepository, clases encargadas únicamente de persistir la información. La información se guarda actualemente en memoria y datos simulados.

- Presentación: Carpeta components: create-subscription.component.ts (Contiene lógica de creación y actualización de la subscriptión) , subscription.component.ts (Contiene listado de las subscripciones y cancelación). Esta capa sólo se comunica con la capa de aplicación a través de inyección de depedencia en el componente y DTO.
