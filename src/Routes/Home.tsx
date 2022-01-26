import { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { getMovies, IGetMoviesResult } from '../api';
import { makeImagePath } from '../utilities';
import { motion,AnimatePresence } from 'framer-motion';

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  text-align: center;
`;

const Banner = styled.div<{bgphoto:string}>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content:center;
  padding:60px;
  background-image:linear-gradient(rgba(0,0,0,1),rgba(0,0,0,0)) ,url(${props=>props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size:40px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size:17px;
  line-height: 24px;
  width:40%;
`;

const Slider = styled.div`
  position:relative;
  top:-100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap:5px;
  grid-template-columns: repeat(6,1fr);
  position: absolute;
  width:100%;
`;

const Box = styled(motion.div)<{bgphoto:string}>`
  background-color: white;
  background-image: url(${props=>props.bgphoto}) ;
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size:66px;
  &:first-child{
    transform-origin:center left;
  }
  &:last-child{
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding:10px;
  background-color: ${props=>props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width:100%;
  bottom:0;
  h4{
    text-align: center;
    font-size:18px;
  }
`;

const rowVariants = {
  hidden: {
    x:window.outerWidth + 5,
  },
  visible: {
    x:0,
  },
  exit : {
    x:-window.outerWidth - 5,
  },
}

const boxVariants = {
  normal:{
    scale:1,
  },
  hover:{
    scale:1.3,
    y:-50,
    transition:{
      delay:0.3,
      duration:0.3,
      type:"tween",
    }
  }
}

const infoVariants = {
  hover:{
    opacity:1,
    transition:{
      delay:0.3,
      duration:0.3,
      type:"tween",
    }
  }
}

  const offset = 6;
export default function Home() {
  const {data, isLoading} = useQuery<IGetMoviesResult>(["movies","nowPlaying"], getMovies);
  const [index,setIndex] = useState(0);
  const [leaving,setLeaving] = useState(false);
  console.log(data);
  const increaseIndex = () => {
    if(data){
      if(leaving) return;
      toggleLeaving();
      const totalMovies = data?.results.length-1;
      const maxIndex = Math.floor(totalMovies / offset)-1;
      setIndex(prev=> prev === maxIndex?0:prev+1);
    }
  };
  const toggleLeaving = () => setLeaving(!leaving);
  
  return (
    <Wrapper>
      {isLoading?
      (<Loader>Loading..</Loader>)
      :
       (
        <>
          <Banner onClick={increaseIndex} bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row 
                variants={rowVariants} 
                initial="hidden" 
                animate="visible"
                exit="exit"
                transition={{
                  type:"tween",
                  duration:1}}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset*index,offset*index+offset).map((movie)=>(
                  <Box 
                    key={movie.id}
                    variants={boxVariants}
                    whileHover="hover"
                    initial="normal"
                    transition={{type:"tween",}}
                    bgphoto={makeImagePath(movie.backdrop_path,"w500")}>
                    <Info variants={infoVariants}>
                      <h4>{movie.title}</h4>
                    </Info>
                  </Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
       )
      }
    </Wrapper>
  )
}



// 1Rr5SrvHxMXHu5RjKpaMba8VTzi.jpg