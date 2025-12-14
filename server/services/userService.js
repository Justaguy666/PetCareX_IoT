import User from '../app/models/User.js';
import mongoose from 'mongoose';

export async function getUserStats(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return null;
    }

    const result = await User.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(userId) } },

        {
            $project: {
                totalFeedings: { $size: '$history' },

                totalSuccess: {
                    $size: {
                        $filter: {
                            input: '$history',
                            as: 'h',
                            cond: { $eq: ['$$h.status', 'success'] }
                        }
                    }
                },

                totalFailures: {
                    $size: {
                        $filter: {
                            input: '$history',
                            as: 'h',
                            cond: { $eq: ['$$h.status', 'missed'] }
                        }
                    }
                },

                averageAmount: {
                    $avg: '$history.amount'
                },

                recentHistory: {
                    $slice: ['$history', -7]
                }
            }
        },

        {
            $addFields: {
                successRate: {
                    $cond: [
                        { $eq: ['$totalFeedings', 0] },
                        0,
                        {
                            $multiply: [
                                { $divide: ['$totalSuccess', '$totalFeedings'] },
                                100
                            ]
                        }
                    ]
                }
            }
        }
    ]);

    return result[0] || null;
}
