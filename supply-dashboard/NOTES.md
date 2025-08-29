DECISIONS-

- Chose React + Apollo client for effective GraphQl queries, mutations and statement management.
- Chose Tailwind Css for responsive design, enabling dashboard adaptation to mobile, tablet, and desktop layouts.
- Chose Recharts for responsive behaviour and for charting (Stock vs Demand) which provides interactive visualization.
- Used Drawer component for implementing detailed product interactions, including mutation for updating demand and transferring stock inorder to keep the main dashboard uncluttered while still providing full interface for product level actions.
- Added pagination to the bottom right column to enable routing between pages/datasets if there are more.


TRADE-OFFS-

- Some UI elements like charts and table rely on memoization, but frequent updates/dependencies change could still cause minor re-rendering and which will slightly impact performance.
- The pagination was implemented just in the frontend, but for large datasets, a server-side pagination would be more efficient.
- Filters i.e search and warehouse update both the chart and table immediately, this may impact performance with very large datasets and may cause unnecessary re-rendering. 


WHAT I"LL IMPROVE WITH MORE TIME-

- I will enhance the chart interactivity with features like zoom, detailed tooltips and multiple series comparisons.
- I will implement server-side pagination and filtering so the backend returns the current page and the applied filters for better scalability, and also so that the changes i make in the frontend will also be effected at the beackend.
- I will add a "dark mode" toggle and customizable themes for better UX, to allow users personalize the interface to their desired taste.
- I will improve the accessibility, i.e including keyboard navigation, high contrast styling, proper ARIA roles/labels and screen reader support to make the dashboard usable for people with disabilities.


