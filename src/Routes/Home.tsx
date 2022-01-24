import React from 'react';
import { useQuery } from 'react-query';
import { getMovies } from '../api';

export default function Home() {
  const {data, isLoading} = useQuery(["movies","noewPlaying"], getMovies);
  console.log(data,isLoading);
  return (
    <div style={{backgroundColor:"white",height:"200vh"}}></div>
  )
}



// 1Rr5SrvHxMXHu5RjKpaMba8VTzi.jpg