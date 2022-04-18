module.exports = (io) => {
    const postsUpdated = () => {
        io.emit('posts:update', {
            message: 'new post created',
        });
    };
    const scheduleUpdated = () => {
        io.emit('schedule:update', {
            message: 'new schedule created',
        });
    };
    return {
        postsUpdated,
        scheduleUpdated,
    };
}