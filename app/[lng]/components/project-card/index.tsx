// NOTE! This is legacy
// TODO: use Card component instead, remove this

import Image from "next/image"

export interface Project {
  id: string,
  title: string,
  imageUrl: string,
  bgColor?: string,
}

interface ProjectCardProps {
  project: Project;
}

export async function ProjectCard(props: ProjectCardProps) {
  const { project } = props
  const bgColor = project.bgColor || 'bg-blue-100'
  return (
    <div className={`${bgColor} max-w-sm rounded overflow-hidden shadow-lg p-4 m-4`}>
      <Image
        className="w-full"
        src={project.imageUrl}
        alt={project.title}
        width={1200}
        height={630}
      />
      <div className="px-6 py-4">
        <h2 className="font-bold text-xl mb-2">{project.title}</h2>
      </div>
    </div>
  )
}
