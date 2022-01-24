import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { getMovies, IGetMoviesResult } from '../api';
import { makeImagePath } from '../utilities';

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  text-align: center;
`;

const Banner = styled.div<{bgPhoto:string}>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content:center;
  padding:60px;
  background-image:linear-gradient(rgba(0,0,0,1),rgba(0,0,0,0)) ,url(${props=>props.bgPhoto});
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

export default function Home() {
  const {data, isLoading} = useQuery<IGetMoviesResult>(["movies","noewPlaying"], getMovies);
  console.log(data,isLoading);
  return (
    <Wrapper>
      {isLoading?
      (<Loader>Loading..</Loader>)
      :
       (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
        </>
       )
      }
    </Wrapper>
  )
}



// 1Rr5SrvHxMXHu5RjKpaMba8VTzi.jpg