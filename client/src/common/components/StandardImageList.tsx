import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useStore } from '../../stores/stores';
import { baseUrl } from '../utils/string';

interface Props{
    images: string[]
}

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

export default function QuiltedImageList({images}: Props) {
  const { commonStore: { showImageViewer, setImgUrl } } = useStore()

  return (
    <ImageList
      sx={{ width: 380, height: 250 }}
      variant="quilted"
      cols={4}
      rowHeight={121}
    >
      {images.map((item, index) => (
        <ImageListItem key={index} cols={2 || 1} rows={2 || 1}>
          <img
            {...srcset(`${baseUrl}/${item}`, 120, 1, 1)}
            alt={item}
            loading="lazy"
              onClick={()=> {
                showImageViewer(true)
                setImgUrl(`${baseUrl}/${item}`)
            }}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

// export default function StandardImageList({images}: Props) {
//   const { commonStore: { showImageViewer, setImgUrl } } = useStore()
  
//   return (
//     <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
//       {images.map((item, index) => (
//         <ImageListItem key={index}>
//           <img
//             srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
//             src={`${baseUrl}/${item}?w=164&h=164&fit=crop&auto=format`}
//             alt={item}
//             loading="lazy"
//             onClick={()=> {
//               showImageViewer(true)
//               setImgUrl(`${baseUrl}/${item}`)
//             }}
//           />
//         </ImageListItem>
//       ))}
//     </ImageList>
//   );
// }
