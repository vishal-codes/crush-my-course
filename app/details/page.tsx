'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import dynamic from 'next/dynamic';

const StarsCanvas = dynamic(() => import('@/components/StarsCanvas'), {
    ssr: false,
});

export default function CourseDetailsForm() {
    const router = useRouter();

    const [dataMap, setDataMap] = useState<Record<string, string[]>>({});
    const [department, setDepartment] = useState('');
    const [course, setCourse] = useState('');
    const [filteredDepartments, setFilteredDepartments] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        fetch('/departments_courses.json')
            .then((res) => res.json())
            .then((data) => {
                setDataMap(data);
                setFilteredDepartments(Object.keys(data));
            });
    }, []);

    useEffect(() => {
        if (!department.trim()) {
            setFilteredDepartments(Object.keys(dataMap));
        } else {
            setFilteredDepartments(
                Object.keys(dataMap).filter((dept) =>
                    dept.toLowerCase().includes(department.toLowerCase())
                )
            );
        }
    }, [department, dataMap]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!department || !course) return;
        router.push(
            `/prof?dept=${encodeURIComponent(department)}&course=${encodeURIComponent(
                course
            )}`
        );
    };

    return (
        <>
            <StarsCanvas show={true} />
            <IoArrowBackCircleSharp
                className="absolute m-5 text-4xl text-[#f97316] cursor-pointer"
                onClick={() => router.push(`/`)}
            />
            <div className="min-h-screen flex items-center justify-center px-4">
                <Card className="w-full max-w-md bg-[#1e1e1e] border-none shadow-lg">
                    <CardContent className="space-y-6 py-8">
                        <form onSubmit={handleSubmit} className="space-y-6 relative">
                            {/* Department input + auto-suggest */}
                            <div>
                                <Label
                                    htmlFor="department"
                                    className="text-white mb-2 block"
                                >
                                    Department
                                </Label>
                                <Input
                                    id="department"
                                    placeholder="Search department (e.g., Computer Science)"
                                    value={department}
                                    onChange={(e) => {
                                        setDepartment(e.target.value);
                                        setShowDropdown(true);
                                        setCourse('');
                                    }}
                                    onFocus={() => setShowDropdown(true)}
                                    onBlur={() =>
                                        setTimeout(() => setShowDropdown(false), 200)
                                    }
                                    className="bg-[#2a2a2a] border-none text-white placeholder-gray-400"
                                />
                                {showDropdown && filteredDepartments.length > 0 && (
                                    <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-md bg-[#2a2a2a] text-white border border-gray-700 shadow-lg">
                                        {filteredDepartments.map((dept) => (
                                            <li
                                                key={dept}
                                                onClick={() => {
                                                    setDepartment(dept);
                                                    setShowDropdown(false);
                                                }}
                                                className="cursor-pointer px-4 py-2 hover:bg-[#3a3a3a]"
                                            >
                                                {dept}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Course dropdown */}
                            <div>
                                <Label htmlFor="course" className="text-white mb-2 block">
                                    Course
                                </Label>
                                <select
                                    id="course"
                                    value={course}
                                    onChange={(e) => setCourse(e.target.value)}
                                    className="w-full bg-[#2a2a2a] text-white border-none rounded-lg px-4 py-2 focus:outline-none"
                                >
                                    <option value="">Select Course</option>
                                    {dataMap[department]?.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="cursor-pointer w-full bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500 text-white text-md font-semibold hover:opacity-90"
                            >
                                Search Professors
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
