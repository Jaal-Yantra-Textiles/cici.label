// import { ContentData } from '@components/css/content/content';
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { fetchTitle , fetchContentData, fetchSidebarData, fetchMetaData} from './directUsActions';
// import { MetaData, SideBarData, WebsiteData } from './services/apiClient';

// interface DirectusState {
//     websiteData: WebsiteData | null;
//     contentData: ContentData[] | null;
//     sideBarData: SideBarData | null
//     metaData: MetaData[] | null
//     status: 'idle' | 'loading' | 'succeeded' | 'failed';
//     error: string | null;
// }

// const initialState: DirectusState = {
//     websiteData: null,
//     contentData: null,
//     sideBarData: null,
//     metaData: null,
//     status: 'idle',
//     error: null,
//   };

// const directusSlice = createSlice({
//     name: 'directus',
//     initialState: {
//         websiteData: {
//             title: '',
//             footer: '',
//             websiteName: '',
//             metaData: [],
//             id: 0
//         },
//         contentData: [
//             {
//                 id: 0,
//                 imgSrc: '',
//                 title: '',
//                 author: '',
//                 desc: '',
//                 imageAWSs3: ''
//             }
//         ],
//         sideBarData:{
//             title:'',
//             subTitle:'',
//             paragraph:'',
//             content:''
//         },
//         metaData:  [
//             {
//                 item: {
//                     description: '',
//                     keywords: '',
//                     author: '',
//                     title: '',
//                     image: '',
//                     url: '',
//                     type: '',
//                     favicon: '',
//                     page: ''

//                 }
//             }
//         ],
//         status: 'idle',
//         error: ''
//     },
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchTitle.pending, (state) => {
//                 state.status = 'loading';
//             })
//             .addCase(fetchTitle.fulfilled, (state, action: PayloadAction<WebsiteData[]>) => {
//                 state.status = 'succeeded';
//                 state.websiteData = action.payload[0];
//             })
//             .addCase(fetchTitle.rejected, (state, action) => {
//                 state.status = 'failed';
//                 state.error = action.error.message as string;
//             })
//             .addCase(fetchContentData.pending, (state) => {
//                 state.status = 'loading';
//             })
//             .addCase(fetchContentData.fulfilled, (state, action: PayloadAction<ContentData[]>) => {
//                 state.status = 'succeeded';
//                 state.contentData = action.payload;
//             })
//             .addCase(fetchContentData.rejected, (state, action) => {
//                 state.status = 'failed';
//                 state.error = action.error.message as string
//             })
//             .addCase(fetchSidebarData.pending, (state) => {
//                 state.status = 'loading';
//             })
//             .addCase(fetchSidebarData.fulfilled, (state, action: PayloadAction<SideBarData>) => {
//                 state.status = 'succeeded';
//                 state.sideBarData = action.payload;
//             })
//             .addCase(fetchSidebarData.rejected, (state, action) => {
//                 state.status = 'failed';
//                 state.error = action.error.message as string;
//             })
//             .addCase(fetchMetaData.pending, (state) => {
//                 state.status = 'loading';
//             })
//             .addCase(fetchMetaData.fulfilled, (state, action: PayloadAction<MetaData>) => {
//                 state.status = 'succeeded';
//                 state.metaData = action.payload;
//             })
//             .addCase(fetchMetaData.rejected, (state, action) => {
//                 state.status = 'failed';
//                 state.error = action.error.message as string;
//             });
//     }
// });

// export default directusSlice.reducer;
