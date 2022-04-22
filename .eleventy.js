const prod = process.env.ELEVENTY_ENV === 'prod';
const Image = require('@11ty/eleventy-img');
const eleventySass = require("eleventy-sass");
const path = require("path");
const fs = require('fs');
const criticalCss = require('eleventy-critical-css');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/img/**/*.gif");
  eleventyConfig.addPassthroughCopy("src/js");

  eleventyConfig.addCollection('projects', (collection) =>
    collection.getFilteredByGlob(`src/projects/*.liquid`).sort((a, b) =>
      a.data.position - b.data.position
    )
  );

  eleventyConfig.addPlugin(eleventySass, {
    compileOptions: {
      permalink: function(contents, inputPath) {
        return path.format({
          dir: "css",
          name: path.basename(inputPath, path.extname(inputPath)),
          ext: ".css"
        });
      }
    },
    sass: {
      style: prod ? "compressed" : "expanded"
    }
  });

  if (prod) {
    eleventyConfig.addPlugin(criticalCss, {
      assetPaths: ['_site/index.html'],
      base: '_site'
    });
  }

  eleventyConfig.addLiquidShortcode('projectImage', projectImage);
  eleventyConfig.addLiquidShortcode('projectPreview', projectPreview);
  eleventyConfig.addLiquidShortcode('slideshow', slideshow);

  return {
    dir: {
      input: 'src'
    }
  }
};

async function projectImage(page, index) {
  return await getPictureTag({
    path: `src/img/${page.fileSlug}/${index}.jpg`,
    dimensions: [450, 900, 1800],
    lazy: index > 1,
    sizes: "(max-width: 56.25rem) 100vw, 56.25rem",
    alt: "",
  });
}

async function projectPreview(item, homePage) {
  const posterPath = `src/img/${item.fileSlug}/poster.jpg`;
  if (!fs.existsSync(posterPath)) return;

  return await getPictureTag({
    path: posterPath,
    dimensions: [220, 440],
    alt: "",
    sizes: "13.75rem",
    lazy: !homePage
  });
}

async function slideshow(page) {
  const pictures = [];
  let index = 1;

  while (fs.existsSync(`src/img/${page.fileSlug}/slideshow-${index}.jpg`)) {
    pictures.push(`src/img/${page.fileSlug}/slideshow-${index}.jpg`)
    index++;
  }

  const pictureElements = await Promise.all(pictures.map(async(picture) =>
    await getPictureTag({
      path: picture,
      dimensions: [450, 900, 1800],
      alt: "",
      sizes: "(max-width: 56.25rem) 100vw, 56.25rem"
    })
  ));

  return `<div class="slideshow">
    <div class="slideshow__container">
      <div class="slideshow__slides">${pictureElements.join('')}</div>
    </div>
    <div class="slideshow__nav">
      ${pictureElements.map((pictureEl, index) =>
        `<button
          aria-label="Image ${index + 1} sur ${pictureElements.length}"
          data-slide=${index}
        >${pictureEl}</button>`
      ).join('')}
    </div>
  </div>`
}

async function getPictureTag(options) {
  const images = await Image(options.path, {
    widths: prod ? options.dimensions : [null],
    formats: prod ? ['avif', 'webp', 'jpeg'] : ['jpeg'],
    outputDir: '_site/img',
  });

  const url = images.jpeg[0].url;
  const sources = Object.values(images)
    .map((imageFormat) => getSourceTag(imageFormat, 1800, options.sizes))
    .join('\n');

  return `<picture>
    ${sources}
    <img
      src="${url}"
      alt="${options.alt}"
      ${options.lazy ? 'loading="lazy" decoding="async"': ''}
      width="${images.jpeg.at(0).width}"
      height="${images.jpeg.at(0).height}"
    />
  </picture>`;
}

// Generate a <source> tag for the given image format
function getSourceTag(imageFormat, maxWidth, sizes) {
  const srcset = imageFormat
    .filter((format) => format.width <= maxWidth)
    .map((entry) => entry.srcset)
    .join(', ');

  return `<source
    type="${imageFormat[0].sourceType}"
    srcset="${srcset}"
    ${sizes ? `sizes="${sizes}"` : ''}
  >`;
}
