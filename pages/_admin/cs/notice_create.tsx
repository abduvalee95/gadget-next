import React from 'react';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import CreateNotice from '../../../libs/components/admin/cs/CreateNotice';

const NoticeCreatePage = () => {
	return (
		<div>
			<CreateNotice />
		</div>
	);
};

export default withAdminLayout(NoticeCreatePage);
