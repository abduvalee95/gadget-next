import React from 'react';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import CreateFaq from '../../../libs/components/admin/cs/CreateFaq';

const FaqCreatePage = () => {
	return (
		<div>
			<CreateFaq />
		</div>
	);
};

export default withAdminLayout(FaqCreatePage);
