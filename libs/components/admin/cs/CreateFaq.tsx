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
import { CREATE_FAQ_BY_ADMIN } from '../../../../apollo/admin/mutation';
import { userVar } from '../../../../apollo/store';
import { GET_FAQS } from '../../../../apollo/user/query';
import { getJwtToken } from '../../../auth';
import { FaqCategory } from '../../../enums/faq.enum';
import useDeviceDetect from '../../../hooks/useDeviceDetect';
import { sweetErrorHandling, sweetMixinSuccessAlert } from '../../../sweetAlert';
import { FaqInput } from '../../../types/faq/faq.input';

const CreateFaq: NextPage = () => {
	const token = getJwtToken();
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);

	const [faqData, setFaqData] = useState<FaqInput>({
		faqCategory: FaqCategory.OTHER,
		faqTitle: '',
		faqContent: '',
	});

	const [createFaq] = useMutation(CREATE_FAQ_BY_ADMIN);
	const {
		loading: getFaqLoading,
		data: getFaqData,
		error: getFaqError,
		refetch: getFaqRefetch,
	} = useQuery(GET_FAQS, {
		fetchPolicy: 'network-only',
		variables: { input: router.query.faqId },
	});

	useEffect(() => {
		setFaqData({
			...faqData,
			faqCategory: getFaqData?.getFaq ? getFaqData?.getFaq?.faqCategory : '',
			faqTitle: getFaqData?.getFaq ? getFaqData?.getFaq?.faqTitle : '',
			faqContent: getFaqData?.getFaq ? getFaqData?.getFaq?.faqContent : '',
		});
	}, [getFaqLoading, getFaqData]);

	/** HANDLERS **/
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFaqData({ ...faqData, [name]: value });
	};

	const handleCategoryChange = (e: SelectChangeEvent<FaqCategory>) => {
		setFaqData({ ...faqData, faqCategory: e.target.value as FaqCategory });
	};

	const handleSubmit = async () => {
		try {
			await createFaq({
				variables: {
					input: faqData,
				},
			});

			await sweetMixinSuccessAlert('This faq has been created successfully.');
			setFaqData({
				faqCategory: FaqCategory.GADGET,
				faqTitle: '',
				faqContent: '',
			});
			await router.push({
				pathname: '/_admin/cs/faq',
			});
		} catch (err) {
			console.error('Error creating FAQ:', err);
			sweetErrorHandling(err).then();
		}
	};

	if (user?.memberType !== 'ADMIN') {
		router.back();
	}

	const isSubmitDisabled = () => {
		return !faqData.faqCategory || !faqData.faqTitle || !faqData.faqContent;
	};

	return (
		<div id="create-faq-page">
			<Stack className="main-title-box">
				<Typography variant="h4" marginBottom={5}>
					Create FAQ
				</Typography>
			</Stack>
			<Stack className="form-box" spacing={2}>
				<FormControl fullWidth>
					<InputLabel id="faq-category-label">FAQ Category</InputLabel>
					<Select
						labelId="faq-category-label"
						label="FAQ Category"
						name="faqCategory"
						value={faqData.faqCategory}
						onChange={handleCategoryChange}
					>
						{Object.values(FaqCategory).map((category) => (
							<MenuItem key={category} value={category}>
								{category}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<TextField label="FAQ Title" name="faqTitle" value={faqData.faqTitle} onChange={handleInputChange} fullWidth />
				<TextField
					label="FAQ Content"
					name="faqContent"
					value={faqData.faqContent}
					onChange={handleInputChange}
					multiline
					fullWidth
				/>
				<Button variant="contained" color="primary" onClick={handleSubmit} disabled={isSubmitDisabled()}>
					Create FAQ
				</Button>
			</Stack>
		</div>
	);
};

export default CreateFaq;
