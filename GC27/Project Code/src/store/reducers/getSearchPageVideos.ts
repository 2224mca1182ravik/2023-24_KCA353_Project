import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { HomePageVideos } from "./../../Types";
import { RootState } from "./../index";
import { YOUTUBE_API_URL } from "../../utilities/constants";
import { parseData } from "../../utilities/video-card-utlities";

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

export const getSearchPageVideos = createAsyncThunk(
  "youtubeApp/searchPageVideos",
  async (isNext: boolean, { getState }) => {
    const {
      youtubeApp: { nextPageToken: nextPageTokenFromState, videos, searchTerm },
    } = getState() as RootState;
    const {
      data: { items, nextPageToken },
    } = await axios.get(
      `${YOUTUBE_API_URL}/search?q=${searchTerm}&key=${API_KEY}&part=snippet&type=video&${
        isNext ? `pageToken=${nextPageTokenFromState}` : ""
      }`
    );
    console.log({ items, nextPageTokenFromState, nextPageToken });
    const parsedData: HomePageVideos[] = await parseData(items);
    return { parsedData: [...videos, ...parsedData], nextPageToken };
  }
);
