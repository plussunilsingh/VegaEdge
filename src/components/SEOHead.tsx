import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  name?: string;
  type?: string;
  url?: string;
  image?: string;
}

export const SEOHead = ({ 
  title = "Vega Greeks Calculator - Market Direction Prediction",
  description = "Predict market direction with the help of VEGA. Vega Greeks Calculator provides advanced trading analysis, stock market insights, and real-time data for traders.",
  name = "Vega Greeks Calculator",
  type = "website",
  url = "https://ibzd.com",
  image = "/img/logo.png"
}: SEOHeadProps) => {
  return (
    <Helmet>
      {/* Standard Metadata tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      <link rel="canonical" href={url} />

      {/* Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};
