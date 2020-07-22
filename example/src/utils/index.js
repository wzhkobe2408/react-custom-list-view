export const sleep = time => {
    return new Promise((resolve, _) => {
        setTimeout(resolve, time);
    });
};

