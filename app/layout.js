import './globals.css';

export const metadata = {
  title: 'ტრადიციული კერძების რეცეპტები მსოფლიოდან | Traditional World Recipes',
  description:
    'Discover authentic traditional recipes from Georgia, Italy, Japan, Mexico, France, and India. Bilingual Georgian and English recipe collection. | გაეცანით მსოფლიოს ტრადიციულ კერძებს.',
  keywords: 'recipes, Georgian cuisine, traditional food, world cuisine, რეცეპტები, ქართული სამზარეულო',
  authors: [{ name: 'ტრადიციული კერძები' }],
  openGraph: {
    title: 'ტრადიციული კერძების რეცეპტები მსოფლიოდან',
    description: 'Authentic traditional recipes from around the world',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ka">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
