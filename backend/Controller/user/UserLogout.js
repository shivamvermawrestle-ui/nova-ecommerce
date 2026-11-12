const UserLogout = (req,res )=> {
try {
    const isProduction = process.env.NODE_ENV === 'production';
    const tokenOption = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'lax',
      }
    res.clearCookie('token',tokenOption)
    res.status(200).json({
        message: 'User logged out successfully',
        success:true,
        data:[]
    })
} catch (error) {
    res.status(400).json({
        message: error.message || error,
        success:false
    })
}
}

export default UserLogout