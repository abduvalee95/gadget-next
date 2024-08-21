import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { NextPage } from 'next';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { CREATE_NOTICE } from '../../../../apollo/admin/mutation';
import { GET_NOTICE } from '../../../../apollo/admin/query';
import { userVar } from '../../../../apollo/store';
import { getJwtToken } from '../../../auth';
import { NoticeCategory } from '../../../enums/notice.enum';
import useDeviceDetect from '../../../hooks/useDeviceDetect';
import { sweetErrorHandling, sweetMixinSuccessAlert } from '../../../sweetAlert';
import { NoticeInput } from '../../../types/notice/notice.input';

const CreateNotice: NextPage = () => {
	const token = getJwtToken();
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);

	const [NoticeData, setNoticeData] = useState<NoticeInput>({
		noticeCategory: NoticeCategory.TERMS,
		noticeTitle: '',
		noticeContent: '',
	});

	const [createNotice] = useMutation(CREATE_NOTICE);
	const {
		loading: getNoticeLoading,
		data: getNoticeData,
		error: getNoticeError,
		refetch: getNoticeRefetch,
	} = useQuery(GET_NOTICE, {
		fetchPolicy: 'network-only',
		variables: { input: router.query.noticeId },
	});

	useEffect(() => {
		setNoticeData({
			...NoticeData,
			noticeCategory: getNoticeData?.getNotices ? getNoticeData?.getNotices?.noticeCategory : '',
			noticeTitle: getNoticeData?.getNotices ? getNoticeData?.getNotices?.noticeTitle : '',
			noticeContent: getNoticeData?.getNotices ? getNoticeData?.getNotices?.noticeContent : '',
		});
	}, [getNoticeLoading, getNoticeData]);

	/** HANDLERS **/
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setNoticeData({ ...NoticeData, [name]: value });
	};

	const handleCategoryChange = (e: SelectChangeEvent<NoticeCategory>) => {
		setNoticeData({ ...NoticeData, noticeCategory: e.target.value as NoticeCategory });
	};

	const handleSubmit = async () => {
		try {
			await createNotice({
				variables: {
					input: NoticeData,
				},
			});

			await sweetMixinSuccessAlert('This notice has been created successfully.');
			setNoticeData({
				noticeCategory: NoticeCategory.INQUIRY,
				noticeTitle: '',
				noticeContent: '',
			});
			await router.push({
				pathname: '/_admin/cs/notice',
			});
		} catch (err) {
			console.error('Error creating NOTICE:', err);
			sweetErrorHandling(err).then();
		}
	};

	if (user?.memberType !== 'ADMIN') {
		router.back();
	}

	const isSubmitDisabled = () => {
		return !NoticeData.noticeCategory || !NoticeData.noticeTitle || !NoticeData.noticeContent;
	};

	return (
		<div id="create-notice-page">
			<Stack className="main-title-box">
				<Typography variant="h4" marginBottom={5}>
					Create NOTICE
				</Typography>
			</Stack>
			<Stack className="form-box" spacing={2}>
				<FormControl fullWidth>
					<InputLabel id="notice-category-label">NOTICE Category</InputLabel>
					<Select
						labelId="notice-category-label"
						label="NOTICE Category"
						name="noticeCategory"
						value={NoticeData.noticeCategory}
						onChange={handleCategoryChange}
					>
						{Object.values(NoticeCategory).map((category) => (
							<MenuItem key={category} value={category}>
								{category}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<TextField
					label="NOTICE Title"
					name="noticeTitle"
					value={NoticeData.noticeTitle}
					onChange={handleInputChange}
					fullWidth
				/>
				<TextField
					label="FAQ Content"
					name="noticeContent"
					value={NoticeData.noticeContent}
					onChange={handleInputChange}
					multiline
					fullWidth
				/>
				<Button
					variant="contained"
					sx={{ width: '200px', height: '50px', color: '#fff', position: 'absolute', right: '25px', top: '54%' }}
					color="primary"
					onClick={handleSubmit}
					disabled={isSubmitDisabled()}
				>
					Create NOTICE
				</Button>
			</Stack>
		</div>
	);
};

export default CreateNotice;
