import { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { getMovies, IGetMoviesResult } from '../api';
import { makeImagePath } from '../utilities';
import { motion,AnimatePresence,useViewportScroll } from 'framer-motion';
import { useMatch, useNavigate } from 'react-router-dom';


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
  cursor: pointer;
  &:first-child{
    transform-origin:center left;
  }
  &:last-child{
    transform-origin: center right;
  }
`;

const Overlay = styled(motion.div)`
  position:fixed;
  top:0;
  width:100%;
  height:100%;
  background-color: rgba(0,0,0,0.7);
  opacity: 0;
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

const BigMovie = styled(motion.div)`
  position:absolute;
  width:40vw;
  height:80vh;
  left:0;
  right:0;
  margin:0 auto;
  background-color: ${props=>props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

const BigCover= styled.img`
  width:100%;
  background-size: cover;
  background-position:center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color:${props=>props.theme.white.lighter};
  text-align: center;
  font-size:36px;
  position:relative;
  top:-60px;
  font-size:45px;
`;

const BigOverview = styled.p`
  padding:20px;
  color:${props=>props.theme.white.lighter};
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
  const navigate =  useNavigate() //react-router-dom v6부턴 history => Navagate로 변경
  const bigMovieMatch = useMatch("/movies/:movieId");
  console.log(bigMovieMatch)
  const  {scrollY} = useViewportScroll();
  const {data, isLoading} = useQuery<IGetMoviesResult>(["movies","nowPlaying"], getMovies);
  const [index,setIndex] = useState(0);
  const [leaving,setLeaving] = useState(false);
  
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
  const onBoxClicked = (movieId:number)=>{
    navigate(`/movies/${movieId}`)
  }

  const onOverlayClick = ()=>{
    navigate('/')
  }

  const clickedMovie =  data?.results.find(movie => movie.id+"" === bigMovieMatch?.params.movieId)
  console.log(clickedMovie)
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
                    layoutId={movie.id+""} 
                    onClick={()=>onBoxClicked(movie.id)}
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
          <AnimatePresence>
            {bigMovieMatch?
              <>
                <Overlay 
                  onClick={onOverlayClick} 
                  animate={{opacity:1}}
                  exit={{opacity:0}}
                />
                <BigMovie
                  layoutId={bigMovieMatch?.params.movieId}
                  style={{top:scrollY.get() + 100}}
                >
                  {clickedMovie && 
                  <>
                    <BigCover 
                      style={{backgroundImage:`linear-gradient(to top,black,transparent), url(${makeImagePath(clickedMovie.backdrop_path,"w500")})`}} />
                    <BigTitle>{clickedMovie.title}</BigTitle>
                    <BigOverview>{clickedMovie.overview}</BigOverview>
                  </>}
                </BigMovie>
              </>
              :null
            }
          </AnimatePresence> 
        </>
       )
      }
    </Wrapper>
  )
}



