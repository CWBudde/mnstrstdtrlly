import { useState } from 'react';
import type { StationImage as StationImageData } from '../data/stations';

interface Props {
  image: StationImageData;
}

/**
 * Lädt ein Foto direkt von Wikimedia Commons (Special:FilePath liefert eine
 * skalierte Version). Schlägt das Laden fehl, wird die Abbildung komplett
 * ausgeblendet – die Rallye funktioniert auch ohne Bilder.
 */
export default function StationImage({ image }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  const encoded = encodeURIComponent(image.file);
  const src = `https://commons.wikimedia.org/wiki/Special:FilePath/${encoded}?width=1000`;
  const descriptionUrl = `https://commons.wikimedia.org/wiki/File:${encoded}`;

  return (
    <figure className="station-image">
      <img src={src} alt={image.alt} loading="lazy" onError={() => setFailed(true)} />
      <figcaption>
        <a href={descriptionUrl} target="_blank" rel="noopener noreferrer">
          {image.credit}
        </a>
      </figcaption>
    </figure>
  );
}
