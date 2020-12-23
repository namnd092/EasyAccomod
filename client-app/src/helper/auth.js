const isDisplayByRole = (roleArr, role) => {
    if (!roleArr) return 'none';
    if (!role) return 'none';
    if (roleArr.indexOf(role.toLowerCase()) !== -1) {
        return '';
    }
    return 'none';
};

export { isDisplayByRole };
